import { useEffect, useRef, useState, useCallback } from "react";

interface UseWebSocketReturn<TMessage> {
  messages: TMessage[];
  sendMessage: (message: TMessage) => void;
  closeConnection: () => void;
  isConnected: boolean;
  error: Event | null;
}

function useWebSocket<TMessage = string>(
  url: string
): UseWebSocketReturn<TMessage> {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Event | null>(null);

  useEffect(() => {
    if (!url) return;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket conectado");
      setIsConnected(true);
    };

    socket.onmessage = (event: MessageEvent) => {
      console.log("📩 Mensagem recebida:", event.data);
      setMessages((prev) => [...prev, event.data as unknown as TMessage]);
    };

    socket.onerror = (err: Event) => {
      console.error("❌ WebSocket erro:", err);
      setError(err);
    };

    socket.onclose = () => {
      console.log("🔌 WebSocket desconectado");
      setIsConnected(false);
    };

    return () => {
      console.log("♻️ Fechando WebSocket");
      socket.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: TMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const data =
        typeof message === "string" ? message : JSON.stringify(message);
      socketRef.current.send(data);
    } else {
      console.warn("⚠️ WebSocket não está aberto.");
    }
  }, []);

  const closeConnection = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, []);

  return { messages, sendMessage, closeConnection, isConnected, error };
}

export default useWebSocket;
