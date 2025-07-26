import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";

interface PaymentFormData {
  selectedPaymentMethod: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
}

const MercadoPago: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    initMercadoPago("TEST-0042d386-6689-4d42-a6fa-64140c5fe061");
    setIsLoading(false);
  }, []);

  const initialization = {
    amount: 10.0, // Valor do produto
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectedPaymentMethod,
    formData,
  }: PaymentFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      // Dados do pagamento para seu backend
      const paymentRequestData = {
        valor: 10.0,
        token: formData.token,
        descricao: "Camiseta Nike - Loja do Icaro",
        email_comprador: "compradorHAHA@test.com",
        installments: formData.installments || 1,
        // Dados específicos do marketplace
        vendedor_id: "vendedor-icaro-123",
        comissao: 5.0, // Sua comissão
      };

      console.log("Enviando pagamento:", paymentRequestData);

      const response = await fetch(
        "http://localhost:3000/mercadopago/processar-pagamento",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentRequestData),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("Resposta do backend:", result);

      setPaymentData(result);

      if (result.status === "approved") {
        setPaymentStatus("approved");
      } else if (result.status === "pending") {
        setPaymentStatus("pending");
      } else {
        setPaymentStatus("rejected");
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Tela de sucesso
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
            <p>
              <strong>ID do Pagamento:</strong> {paymentData?.id}
            </p>
            <p>
              <strong>Produto:</strong> Camiseta Nike - Loja do Icaro
            </p>
            <p>
              <strong>Valor:</strong> R${" "}
              {paymentData?.transaction_amount?.toFixed(2)}
            </p>
            <p>
              <strong>Vendedor:</strong> {paymentData?.metadata?.vendedor_id}
            </p>
            <p>
              <strong>Comissão Plataforma:</strong> R${" "}
              {paymentData?.metadata?.comissao_plataforma?.toFixed(2)}
            </p>
            <p>
              <strong>Valor Líquido (Vendedor):</strong> R${" "}
              {paymentData?.transaction_details?.net_received_amount?.toFixed(
                2
              )}
            </p>
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

  // Tela de loading
  if (isLoading) {
    return (
      <div className="mercado-pago-loading">
        <p>Carregando sistema de pagamento...</p>
      </div>
    );
  }

  // Tela de erro
  if (error) {
    return (
      <div className="mercado-pago-error">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => setError("")}>Tentar novamente</button>
      </div>
    );
  }

  // Tela principal de pagamento
  return (
    <div className="mercado-pago-container">
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h2>Finalizar Compra</h2>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <h3>Camiseta Nike</h3>
            <p>
              <strong>Vendedor:</strong> Loja do Icaro
            </p>
            <p>
              <strong>Descrição:</strong> Camiseta esportiva de alta qualidade
            </p>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#007bff",
              }}
            >
              R$ 10,00
            </p>
            <small style={{ color: "#6c757d" }}>
              Taxa da plataforma: 5%
            </small>
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
