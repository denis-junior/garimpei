import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, CreditCard, DollarSign, Store } from "lucide-react";
import { formatCurrencyBR } from "@/utils/formatCurrencyBr";
import { Button } from "@/components/ui/button";
import { processPaymentResponse } from "../types";
import { IProduct } from "@/modules/Product/types/product";
interface SuccessProps {
  paymentData: processPaymentResponse | null;
  product: IProduct | undefined;
  resetPayment: () => void;
  amount: number;
}
const SuccessPayment: React.FC<SuccessProps> = ({
  paymentData,
  product,
  resetPayment,
  amount,
}) => {
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
};

export default SuccessPayment;
