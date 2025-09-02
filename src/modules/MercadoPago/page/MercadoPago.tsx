import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";

interface PaymentFormData {
  selectedPaymentMethod: string;
  formData: any;
}

const MercadoPago: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);
  // ✅ ESTADOS PARA VENDEDOR
  const [vendedorConectado, setVendedorConectado] = useState<boolean>(false);
  const [vendedorInfo, setVendedorInfo] = useState<any>(null);
  
  // ✅ ID REAL DO VENDEDOR (deve vir de props ou context)
  const vendedorId = "7"; // Trocar por ID real

  useEffect(() => {
    initMercadoPago("APP_USR-7fcc197c-c5b3-42da-a0cd-6e30a9369914");
    verificarStatusVendedor();
  }, []);

  const verificarStatusVendedor = async () => {
    try {
      const response = await fetch(`http://localhost:3000/mercadopago/status/${vendedorId}`);
      const data = await response.json();
      
      setVendedorConectado(data.conectado || false);
      setVendedorInfo(data);
      
      console.log('Status do vendedor:', data);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setError('Erro ao verificar status do vendedor');
    } finally {
      setIsLoading(false);
    }
  };

  const conectarVendedor = async () => {
    try {
      // 1. Buscar link de conexão
      const response = await fetch(`http://localhost:3000/mercadopago/conectar/${vendedorId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message);
      }

      // 2. Abrir popup
      const popup = window.open(
        data.link_conexao,
        'mercadopago-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // 3. Escutar resposta do callback
      const handleMessage = (event: MessageEvent) => {
        if (event.data.success) {
          console.log('✅ Conta conectada!');
          setVendedorConectado(true);
          popup?.close();
          // Recarregar status
          verificarStatusVendedor();
        } else {
          console.error('❌ Erro:', event.data.message);
          alert(`Erro ao conectar: ${event.data.message}`);
        }
        window.removeEventListener('message', handleMessage);
      };

      window.addEventListener('message', handleMessage);

    } catch (error) {
      console.error('Erro ao conectar:', error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const initialization = {
    amount: 5.0,
  };

  const customization = {
    paymentMethods: {
      ticket: "all",
      bankTransfer: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: ["all"],
    },
  };

  const onSubmit = async ({
    selectedPaymentMethod,
    formData,
  }: PaymentFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      // ✅ USAR SPLIT AUTOMÁTICO
      const paymentRequestData = {
        valor: 5.0,
        token: formData.token,
        descricao: "Camiseta Nike - Loja do Icaro",
        email_comprador: "compradorHAHA@test.com",
        installments: formData.installments || 1,
        // ✅ DADOS DO SPLIT
        vendedor_id: vendedorId,
        comissao: 3.00, // R$ 0,50 de comissão (10%)
        produto_id: "produto-123", // ID do produto
      };

      console.log("Enviando pagamento com split:", paymentRequestData);

      // ✅ ENDPOINT DE SPLIT
      const response = await fetch(
        "http://localhost:3000/mercadopago/processar-pagamento-split",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentRequestData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Resposta do split:", result);

      setPaymentData(result);

      // ✅ VERIFICAR RESPOSTA DO SPLIT
      if (result.success && result.response?.status === "approved") {
        setPaymentStatus("approved");
      } else if (result.success && result.response?.status === "pending") {
        setPaymentStatus("pending");
      } else {
        setPaymentStatus("rejected");
        setError(result.response?.status_detail || "Pagamento rejeitado");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      if (error instanceof Error) {
        setError(`Erro ao processar pagamento: ${error.message}`);
      } else {
        setError("Erro ao processar pagamento: erro desconhecido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onError = async (error: any): Promise<void> => {
    console.error("Erro no brick:", error);
    setError("Erro no sistema de pagamento");
  };

  const onReady = async (): Promise<void> => {
    console.log("Brick pronto");
  };

  const resetPayment = () => {
    setPaymentStatus("");
    setError("");
    setPaymentData(null);
  };

  // ✅ TELA PARA CONECTAR VENDEDOR
  if (!vendedorConectado && !isLoading) {
    return (
      <div className="mercado-pago-container">
        <div style={{ 
          padding: "20px", 
          textAlign: "center",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffeaa7"
        }}>
          <h2>🔗 Conectar Conta do Mercado Pago</h2>
          <p>Para processar pagamentos com split automático, o vendedor precisa conectar sua conta do Mercado Pago.</p>
          
          <div style={{ margin: "20px 0" }}>
            <p><strong>Vendedor ID:</strong> {vendedorId}</p>
            <p><strong>Status:</strong> Não conectado</p>
          </div>
          
          <button 
            onClick={conectarVendedor}
            style={{
              padding: '15px 30px',
              backgroundColor: '#009EE3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔗 Conectar Mercado Pago
          </button>
          
          <div style={{ marginTop: "15px", fontSize: "14px", color: "#856404" }}>
            <p>✅ Split automático entre vendedor e plataforma</p>
            <p>✅ Vendedor recebe direto na conta</p>
            <p>✅ Plataforma recebe comissão automaticamente</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ TELA DE SUCESSO COM DADOS DO SPLIT
  if (paymentStatus === "approved") {
    return (
      <div className="mercado-pago-container">
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#d4edda",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ color: "green" }}>✅ Pagamento Aprovado!</h2>
          <div style={{ margin: "20px 0" }}>
            <p><strong>ID do Pagamento:</strong> {paymentData?.payment_id}</p>
            <p><strong>Referência Externa:</strong> {paymentData?.external_reference}</p>
            <p><strong>Produto:</strong> Camiseta Nike - Loja do Icaro</p>
            <p><strong>Valor Total:</strong> R$ {paymentData?.valor_total?.toFixed(2)}</p>
            
            {/* ✅ DETALHES DO SPLIT */}
            <div style={{ 
              backgroundColor: "#e9ecef", 
              padding: "15px", 
              borderRadius: "8px",
              margin: "15px 0" 
            }}>
              <h4>💰 Split Automático Processado:</h4>
              <p><strong>🏪 Vendedor recebeu:</strong> R$ {paymentData?.valor_vendedor?.toFixed(2)}</p>
              <p><strong>🏢 Comissão da plataforma:</strong> R$ {paymentData?.comissao_plataforma?.toFixed(2)}</p>
              <p style={{ fontSize: "12px", color: "#666" }}>
                ✅ Valores automaticamente divididos via Mercado Pago
              </p>
            </div>
            
            <p><strong>Status:</strong> {paymentData?.status}</p>
          </div>
          <button
            onClick={resetPayment}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Fazer outro pagamento
          </button>
        </div>
      </div>
    );
  }

  // ✅ LOADING
  if (isLoading) {
    return (
      <div className="mercado-pago-loading">
        <p>Carregando sistema de pagamento...</p>
      </div>
    );
  }

  // ✅ ERRO
  if (error) {
    return (
      <div className="mercado-pago-error">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => setError("")}>Tentar novamente</button>
      </div>
    );
  }

  // ✅ TELA PRINCIPAL DE PAGAMENTO (VENDEDOR CONECTADO)
  return (
    <div className="mercado-pago-container">
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h2>Finalizar Compra</h2>
          
          {/* ✅ STATUS DO VENDEDOR */}
          <div style={{ 
            backgroundColor: "#d4edda", 
            padding: "10px", 
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            ✅ Vendedor conectado - Split automático ativo
          </div>
          
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <h3>Camiseta Nike</h3>
            <p><strong>Vendedor:</strong> Loja do Icaro</p>
            <p><strong>Descrição:</strong> Camiseta esportiva de alta qualidade</p>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}>
              R$ 5,00
            </p>
            <div style={{ fontSize: "12px", color: "#6c757d" }}>
              <p>💰 Vendedor recebe: R$ 4,50</p>
              <p>🏢 Comissão plataforma: R$ 0,50 (10%)</p>
            </div>
          </div>
        </div>

        <Payment
          initialization={initialization}
          customization={customization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
      </div>
    </div>
  );
};

export default MercadoPago;
