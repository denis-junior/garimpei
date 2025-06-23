import { useEffect, useRef, useState } from "react";

interface SSEOptions<T = unknown> {
  onMessage?: (data: T) => void;
  onError?: (error: Event) => void;
  events?: { [eventName: string]: (data: T) => void };
  withCredentials?: boolean;
  reconnectInterval?: number;
  autoReconnect?: boolean;
  parse?: boolean;
}

export function useSSE<T = unknown>(url: string, options?: SSEOptions<T>) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<T[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeout = useRef<number | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const token = localStorage.getItem("token");

    const connect = () => {
      if (eventSourceRef.current) return;

      // Append token as a query parameter since EventSource does not support headers
      const urlWithToken =
        token != null
          ? url +
            (url.includes("?") ? "&" : "?") +
            `token=${encodeURIComponent(token)}`
          : url;

      const es = new EventSource(urlWithToken, {
        withCredentials: options?.withCredentials ?? false,
      });

      eventSourceRef.current = es;
      setConnected(true);

      es.onmessage = (event) => {
        if (isCancelled) return;

        const data: T = options?.parse
          ? JSON.parse(event.data)
          : (event.data as unknown as T);

        setMessages((prev) => [...prev, data]);
        options?.onMessage?.(data);
      };

      if (options?.events) {
        for (const [eventName, handler] of Object.entries(options.events)) {
          es.addEventListener(eventName, (event: MessageEvent) => {
            if (isCancelled) return;
            const data: T = options?.parse
              ? JSON.parse(event.data)
              : (event.data as unknown as T);
            handler(data);
          });
        }
      }

      es.onerror = (err) => {
        console.error("SSE error:", err);
        setConnected(false);
        eventSourceRef.current?.close();
        eventSourceRef.current = null;

        options?.onError?.(err);

        if (options?.autoReconnect) {
          reconnectTimeout.current = setTimeout(
            connect,
            options?.reconnectInterval ?? 3000
          );
        }
      };
    };

    connect();

    return () => {
      isCancelled = true;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      setConnected(false);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [url]);

  return { connected, messages };
}
