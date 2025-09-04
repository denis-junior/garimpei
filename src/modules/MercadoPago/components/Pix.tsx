import React, { useEffect } from "react";
import { processPaymentResponse } from "../types";
import { useGetPixStatus, usePostPixPayment } from "../services";
import { IProduct } from "@/modules/Product/types/product";

interface PixProps {
  paymentData?: processPaymentResponse | null;
  setPaymentStatus: (status: string) => void;
  setPaymentData: (data: processPaymentResponse | null) => void;
  setError: (error: string) => void;
  product?: IProduct;
  paymentStatus: string;
}

const Pix: React.FC<PixProps> = ({
  paymentData,
  paymentStatus,
  setPaymentStatus,
  setPaymentData,
  setError,
  product,
}) => {
  const { mutateAsync: postPixPayment, isPending: isLoadingPix } =
    usePostPixPayment();

  const { data: pixStatus } = useGetPixStatus({
    status: paymentStatus,
    id: paymentData?.payment_id,
  });

  const copyToClipboard = () => {
    if (paymentData?.qr_code) {
      navigator.clipboard.writeText(paymentData.qr_code);
      alert("✅ Código PIX copiado para a área de transferência!");
    }
  };

  const cancelarPix = () => {
    setPaymentStatus("");
    setPaymentData(null);
    setError("");
  };

  const criarPixComQrCode = async () => {
    try {
      const dadosPix = {
        valor: 1.0,
        descricao: "Camiseta Nike - Loja do Icaro",
        email_comprador: "compradorHAHA@test.com",
        vendedor_id: product?.store?.seller?.id.toString() || "",
        comissao: 0.5,
      };

      const response = await postPixPayment(dadosPix);

      if (response.success && response.qr_code) {
        setPaymentData(response);
        setPaymentStatus("pending_pix");
      } else {
        throw new Error("Erro ao gerar PIX");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`Erro: ${error.message}`);
      } else {
        setError(`Erro: ${String(error)}`);
      }
    }
  };

  useEffect(() => {
    if (pixStatus?.status_mp === "approved") {
      setPaymentStatus("approved");
    }
  }, [pixStatus]);

  return (
    <div>
      <div className="mb-5 text-center">
        <h3 className="mb-5 font-medium">Escolha como pagar:</h3>

        <div className="flex gap-4 justify-center flex-wrap mb-5">
          {!paymentData?.qr_code_base64 ? (
            <button
              onClick={criarPixComQrCode}
              disabled={isLoadingPix}
              className="px-6 py-4 bg-teal-500 hover:bg-teal-600 text-white border-none rounded-lg text-base cursor-pointer font-bold min-w-[180px] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {isLoadingPix ? "Gerando..." : "📱 Pagar com PIX"}
            </button>
          ) : (
            <button
              onClick={cancelarPix}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white border-none rounded-md text-sm cursor-pointer font-bold mb-4 transition-colors"
            >
              ❌ Cancelar PIX
            </button>
          )}
        </div>
      </div>

      {/* QR CODE Section */}
      {paymentData?.qr_code_base64 && (
        <div className="my-5">
          <h3 className="mb-3 font-medium">📱 Escaneie o QR Code:</h3>

          <div className="flex justify-center my-4">
            <img
              src={`data:image/png;base64,${paymentData.qr_code_base64}`}
              alt="QR Code PIX"
              className="max-w-[250px] border-2 border-teal-500 rounded-lg p-4 bg-white"
            />
          </div>
          <p className="text-sm text-yellow-600">
            ✅ Abra seu app do banco e escaneie o código
          </p>
        </div>
      )}

      {/* Copy PIX Code Section */}
      {paymentData?.qr_code && (
        <div className="my-5">
          <h4 className="mb-3 font-medium">💳 Ou copie o código PIX:</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 text-xs break-all max-h-32 overflow-auto my-3 font-mono">
            {paymentData.qr_code}
          </div>
          <button
            onClick={copyToClipboard}
            className="px-5 py-3 bg-teal-500 hover:bg-teal-600 text-white border-none rounded-md cursor-pointer text-sm font-bold transition-colors"
          >
            📋 Copiar Código PIX
          </button>
        </div>
      )}
    </div>
  );
};

export default Pix;
