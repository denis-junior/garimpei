import { useGetProduct } from "@/modules/Product/services/CRUD-product";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetStatusSeller, usePostProcessPayment } from "../services";
import { IBrickError } from "@mercadopago/sdk-react/esm/bricks/util/types/common";
import { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { useUser } from "@/hooks/useUser";
import { processPaymentResponse } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Store,
  DollarSign,
} from "lucide-react";
import Loader from "@/components/Loader";
import { formatCurrencyBR } from "@/utils/formatCurrencyBr";

const MercadoPago: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product } = useGetProduct(id as string);
  const { data: statusConectSeller, isPending: isLoadingStatus } =
    useGetStatusSeller(product?.store?.seller?.id);
  const { user } = useUser();

  const { mutateAsync: processPayment } = usePostProcessPayment();

  const [error, setError] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentData, setPaymentData] = useState<processPaymentResponse | null>(
    null
  );

  useEffect(() => {
    initMercadoPago(import.meta.env.VITE_API_TOKEN_MERCADO_PAGO);
  }, []);

  const amount = 5.0;
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
      hideFormTitle: true,
    },
    texts: {
      formTitle: "Dados do Pagamento",
      emailSectionTitle: "E-mail",
      cardholderName: {
        label: "Nome do portador do cartão",
        placeholder: "Digite o nome como está no cartão",
      },
      email: {
        label: "E-mail",
        placeholder: "Digite seu e-mail",
      },
      cardNumber: {
        label: "Número do cartão",
        placeholder: "0000 0000 0000 0000",
      },
      expirationDate: {
        label: "Data de vencimento",
        placeholder: "MM/AA",
      },
      securityCode: {
        label: "Código de segurança",
        placeholder: "123",
      },
      installments: {
        label: "Parcelas",
      },
      identificationTypes: {
        label: "Tipo de documento",
      },
      identificationType: {
        label: "Tipo de documento",
      },
      identificationNumber: {
        label: "Número do documento",
        placeholder: "Digite seu CPF",
      },
      entityType: {
        label: "Tipo de pessoa",
      },
      financialInstitution: {
        label: "Banco",
      },
      bankTransferType: {
        label: "Tipo de transferência",
      },
      formSubmit: "Finalizar Pagamento",
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
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-yellow-600" />
            </div>
            <CardTitle className="text-yellow-800">
              Método de pagamento não ativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-yellow-700">
              O vendedor ainda não ativou o Mercado Pago para receber
              pagamentos.
            </p>

            <Card className="bg-yellow-100 border-yellow-300">
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Vendedor ID:</span>
                    <span>{product?.store?.seller?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge variant="destructive">Não conectado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
              <p className="text-sm text-yellow-800 text-center">
                ⚠️ Sem o método ativo, não é possível finalizar a compra.
                <br />O vendedor precisa conectar sua conta para ativar
                pagamentos e split automático.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success page
  if (paymentStatus === "approved") {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-green-800 text-2xl">
              Pagamento Aprovado!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Detalhes do Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      ID do Pagamento
                    </p>
                    <p className="font-medium">{paymentData?.payment_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Referência Externa
                    </p>
                    <p className="font-medium">
                      {paymentData?.external_reference}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Produto</p>
                    <p className="font-medium">{product?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="font-bold text-lg text-green-600">
                      {formatCurrencyBR(paymentData?.valor_total || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                  <DollarSign className="h-5 w-5" />
                  Split Automático Processado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">
                        Vendedor recebeu
                      </span>
                    </div>
                    <span className="font-bold text-green-600">
                      {formatCurrencyBR(paymentData?.valor_vendedor || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        Comissão plataforma
                      </span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {formatCurrencyBR(Number((amount * 0.1).toFixed(2)))}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  ✅ Valores automaticamente divididos via Mercado Pago
                </p>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                onClick={resetPayment}
                size="lg"
                className="w-full md:w-auto"
              >
                Fazer outro pagamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <AlertDialog open={!!error}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-600">
                Erro no Pagamento
              </AlertDialogTitle>
              <AlertDialogDescription className="text-red-700">
                {error}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setError("")}>
                Tentar novamente
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Main payment page
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-1  gap-6">
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
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Finalizar Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Payment
                initialization={initialization}
                customization={customization}
                onSubmit={onSubmit}
                onReady={onReady}
                onError={onError}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MercadoPago;
