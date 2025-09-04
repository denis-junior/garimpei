import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProduct } from "@/modules/Product/types/product";
import { AlertTriangle } from "lucide-react";
interface SellerNotConnectedProps {
  product: IProduct | undefined;
}
const SellerNotConnected = ({ product }: SellerNotConnectedProps) => {
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
            O vendedor ainda não ativou o Mercado Pago para receber pagamentos.
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
              <br />O vendedor precisa conectar sua conta para ativar pagamentos
              e split automático.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerNotConnected;
