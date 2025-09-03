import { useGetProduct } from "@/modules/Product/services/CRUD-product";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetStatusSeller, usePostProcessPayment } from "../services";
import { IBrickError } from "@mercadopago/sdk-react/esm/bricks/util/types/common";
import { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { useUser } from "@/hooks/useUser";
import { processPaymentResponse } from "../types";

const MercadoPago: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product } = useGetProduct(id as string);
  const { data: statusConectSeller, isPending: isLoadingStatus } =
    useGetStatusSeller(product?.store?.seller?.id);
  const { user } = useUser();

  const { mutateAsync: processPayment } = usePostProcessPayment();

  console.log(product, "product");

  const [error, setError] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentData, setPaymentData] = useState<processPaymentResponse | null>(
    null
  );

  useEffect(() => {
    initMercadoPago(import.meta.env.VITE_API_TOKEN_MERCADO_PAGO);
  }, []);

  const amount = 5.0; // Number(product?.bids?.[0]?.bid);
  const initialization = {
    amount: amount,
  };

  const customization = {
    paymentMethods: {
      ticket: "all",
      bankTransfer: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: ["all"],
    },
    visual: {
      hideFormTitle: false,
    },
  };

  const onSubmit = async ({
    selectedPaymentMethod,
    formData,
  }: IPaymentFormData): Promise<void> => {
    try {
      if (!product) {
        throw new Error("Produto não encontrado");
      }
      setError("");

      // ✅ VALIDAR SE TOKEN EXISTE
      if (!formData.token) {
        throw new Error(
          "Token de pagamento não foi gerado. Verifique os dados do cartão."
        );
      }

      // ✅ USAR SPLIT AUTOMÁTICO
      const paymentRequestData = {
        valor: amount,
        token: formData.token,
        descricao: product?.name || "Produto sem descrição",
        email_comprador: user?.email || "",
        installments: formData.installments || 1,
        // ✅ ADICIONAR payment_method_id também
        payment_method_id: formData.payment_method_id || selectedPaymentMethod,
        // ✅ DADOS DO SPLIT
        vendedor_id: product?.store?.seller?.id.toString(),
        comissao: Number((amount * 0.1).toFixed(2)), // valor arrecadado para plataforma
        produto_id: product?.id.toString(),
      };

      console.log("Enviando pagamento com split:", paymentRequestData);

      // ✅ ENDPOINT DE SPLIT
      const response = await processPayment(paymentRequestData);
      console.log(response);
      // const response = await fetch(
      //   "http://localhost:3000/mercadopago/processar-pagamento-split",
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(paymentRequestData),
      //   }
      // );
      setPaymentData(response);
      // ✅ VERIFICAR RESPOSTA DO SPLIT
      if (response.success && response.response?.status === "approved") {
        setPaymentStatus("approved");
      } else if (response.success && response.response?.status === "pending") {
        setPaymentStatus("pending");
      } else {
        setPaymentStatus("rejected");
        setError(response.response?.status_detail || "Pagamento rejeitado");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      if (error instanceof Error) {
        setError(`Erro ao processar pagamento: ${error.message}`);
      } else {
        setError("Erro ao processar pagamento: erro desconhecido");
      }
    }
  };

  const onError = async (error: IBrickError): Promise<void> => {
    console.error("❌ Erro detalhado no brick:", error);
    console.error("❌ Tipo do erro:", typeof error);
    setError(
      `Erro no sistema de pagamento: ${error.message || JSON.stringify(error)}`
    );
  };

  const onReady = async (): Promise<void> => {
    console.log("Brick pronto carregado metodos de pagamento");
  };

  const resetPayment = () => {
    setPaymentStatus("");
    setError("");
    setPaymentData(null);
  };

  // ✅ TELA PARA CONECTAR VENDEDOR
  if (!statusConectSeller?.conectado) {
    return (
      <div className="mercado-pago-container">
        <div
          style={{
            maxWidth: "500px",
            margin: "40px auto",
            padding: "32px",
            textAlign: "center",
            background: "linear-gradient(135deg, #f8fafc 60%, #ffeaa7 100%)",
            borderRadius: "16px",
            border: "1px solid #ffeaa7",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          }}
        >
          <img
            src="https://http2.mlstatic.com/frontend-assets/mercadopago/home/mp-logo.svg"
            alt="Mercado Pago"
            style={{ width: "80px", marginBottom: "18px" }}
          />
          <h2 style={{ color: "#009EE3", marginBottom: "10px" }}>
            Método de pagamento não ativo
          </h2>
          <p style={{ color: "#856404", marginBottom: "18px" }}>
            O vendedor ainda não ativou o Mercado Pago para receber pagamentos.
          </p>
          <div
            style={{
              background: "#fffbe6",
              border: "1px solid #ffeaa7",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "18px",
              fontSize: "15px",
            }}
          >
            <p>
              <strong>Vendedor ID:</strong> {product?.store?.seller?.id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "#d35400", fontWeight: "bold" }}>
                Não conectado
              </span>
            </p>
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "#856404",
              background: "#fffbe6",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <p>⚠️ Sem o método ativo, não é possível finalizar a compra.</p>
            <p>
              O vendedor precisa conectar sua conta para ativar pagamentos e
              split automático.
            </p>
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
            <p>
              <strong>ID do Pagamento:</strong> {paymentData?.payment_id}
            </p>
            <p>
              <strong>Referência Externa:</strong>{" "}
              {paymentData?.external_reference}
            </p>
            <p>
              <strong>Produto:</strong> {product?.name}
            </p>
            <p>
              <strong>Valor Total:</strong> R${" "}
              {paymentData?.valor_total?.toFixed(2)}
            </p>

            {/* ✅ DETALHES DO SPLIT */}
            <div
              style={{
                backgroundColor: "#e9ecef",
                padding: "15px",
                borderRadius: "8px",
                margin: "15px 0",
              }}
            >
              <h4>💰 Split Automático Processado:</h4>
              <p>
                <strong>🏪 Vendedor recebeu:</strong> R${" "}
                {paymentData?.valor_vendedor?.toFixed(2)}
              </p>
              <p>
                <strong>🏢 Comissão da plataforma:</strong> R${" "}
                {Number((amount * 0.1).toFixed(2))}
              </p>
              <p style={{ fontSize: "12px", color: "#666" }}>
                ✅ Valores automaticamente divididos via Mercado Pago
              </p>
            </div>

            <p>
              <strong>Status:</strong> {paymentData?.status}
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

  // ✅ LOADING
  if (isLoadingStatus) {
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
          <div
            style={{
              backgroundColor: "#d4edda",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
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
            <h3>{product?.name}</h3>
            <p>
              <strong>Vendedor:</strong> {product?.store?.name}
            </p>
            <p>
              <strong>Descrição:</strong> {product?.description}
            </p>
            <p
              style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}
            >
              R$ {Number(amount).toFixed(2)}
            </p>
            <div style={{ fontSize: "12px", color: "#6c757d" }}>
              <p>
                💰 Vendedor recebe: R${" "}
                {Number(amount) - Number((amount * 0.1).toFixed(2))}
              </p>
              <p>
                🏢 Comissão plataforma: {Number((amount * 0.1).toFixed(2))}{" "}
                (10%)
              </p>
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
