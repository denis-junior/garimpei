import { useGetProduct } from "@/modules/Product/services/CRUD-product";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetStatusSeller, usePostProcessPayment } from "../services";
import { IBrickError } from "@mercadopago/sdk-react/esm/bricks/util/types/common";
import { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { useUser } from "@/hooks/useUser";
import { processPaymentResponse } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CreditCard, Store } from "lucide-react";
import Loader from "@/components/Loader";
import { formatCurrencyBR } from "@/utils/formatCurrencyBr";
import Pix from "../components/Pix";
import { customization } from "../utils/initialMercadoPago";
import ErrorPayment from "../components/Error";
import SuccessPayment from "../components/Success";
import SellerNotConnected from "../components/SellerNotConnected";

const MercadoPago: React.FC = () => {
  initMercadoPago(import.meta.env.VITE_API_TOKEN_MERCADO_PAGO);
  const { id } = useParams<{ id: string }>();
  const { data: product } = useGetProduct(id as string);
  const { data: statusConectSeller, isPending: isLoadingStatus } =
    useGetStatusSeller(product?.store?.seller?.id);
  const { user } = useUser();

  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentData, setPaymentData] = useState<processPaymentResponse | null>(
    null
  );

  const { mutateAsync: processPayment } = usePostProcessPayment();

  const [error, setError] = useState<string>("");

  const amount = 1.0;
  const initialization = { amount };

  const onSubmit = async ({
    selectedPaymentMethod,
    formData,
  }: IPaymentFormData): Promise<void> => {
    try {
      if (!product) {
        throw new Error("Produto não encontrado");
      }
      setError("");

      if (!formData.token) {
        throw new Error(
          "Token de pagamento não foi gerado. Verifique os dados do cartão."
        );
      }

      const paymentRequestData = {
        valor: amount,
        token: formData.token,
        descricao: product?.name || "Produto sem descrição",
        email_comprador: user?.email || "",
        installments: formData.installments || 1,
        payment_method_id: formData.payment_method_id || selectedPaymentMethod,
        vendedor_id: product?.store?.seller?.id.toString(),
        comissao: Number((amount * 0.1).toFixed(2)),
        produto_id: product?.id.toString(),
      };

      const response = await processPayment(paymentRequestData);

      setPaymentData(response);
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

  // Loading state
  if (isLoadingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Seller not connected
  if (!statusConectSeller?.conectado) {
    return <SellerNotConnected product={product} />;
  }

  // Success page
  if (paymentStatus === "approved") {
    return (
      <SuccessPayment
        paymentData={paymentData}
        product={product}
        resetPayment={resetPayment}
        amount={amount}
      />
    );
  }

  // Error state
  if (error) {
    return <ErrorPayment error={error} setError={setError} />;
  }

  // Main payment page
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Product Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Resumo da Compra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">{product?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Vendedor:</span>{" "}
                  {product?.store?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product?.description}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrencyBR(amount)}
                  </p>
                </div>
              </div>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Vendedor conectado - Split automático ativo
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Vendedor recebe:</span>
                  <span className="font-medium">
                    {formatCurrencyBR(
                      Number(amount) - Number((amount * 0.1).toFixed(2))
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Comissão plataforma (10%):</span>
                  <span className="font-medium">
                    {formatCurrencyBR(Number((amount * 0.1).toFixed(2)))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Finalizar Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Pix
                paymentData={paymentData}
                setPaymentStatus={setPaymentStatus}
                setPaymentData={setPaymentData}
                setError={setError}
                paymentStatus={paymentStatus}
              />
              {paymentStatus !== "pending_pix" && (
                <Payment
                  initialization={initialization}
                  customization={customization}
                  onSubmit={onSubmit}
                  onReady={onReady}
                  onError={onError}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MercadoPago;
