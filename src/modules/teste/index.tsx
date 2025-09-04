import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import { customization } from "../MercadoPago/page/MercadoPago";

interface PaymentFormData {
  selectedPaymentMethod: string;
  formData: any;
}

const MercadoPagoPIX: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);
  // ✅ ESTADOS PARA VENDEDOR
  const [vendedorConectado, setVendedorConectado] = useState<boolean>(false);
  const [vendedorInfo, setVendedorInfo] = useState<any>(null);
  // ✅ ADICIONAR ESTADO PARA CONTROLAR EXIBIÇÃO DO BRICK
  const [showPaymentBrick, setShowPaymentBrick] = useState<boolean>(false);

  // ✅ ID REAL DO VENDEDOR (deve vir de props ou context)
  const vendedorId = "10"; // Trocar por ID real

  useEffect(() => {
    initMercadoPago("APP_USR-7fcc197c-c5b3-42da-a0cd-6e30a9369914");
    verificarStatusVendedor();
  }, []);

  // Frontend - useEffect com polling
  useEffect(() => {
    if (paymentStatus === "pending_pix") {
      const interval = setInterval(async () => {
        const response = await fetch(
          `http://localhost:3000/mercadopago/pagamento/status/${paymentData.payment_id}`
        );
        const result = await response.json();

        if (result.status_mp === "approved") {
          setPaymentStatus("approved"); // ✅ ATUALIZA TELA
          clearInterval(interval);
        }
      }, 5000); // ✅ A cada 5 segundos
    }
  }, [paymentStatus]);

  const verificarStatusVendedor = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/mercadopago/status/${vendedorId}`
      );
      const data = await response.json();

      setVendedorConectado(data.conectado || false);
      setVendedorInfo(data);

      console.log("Status do vendedor:", data);

      // ✅ VERIFICAR CAPACIDADES ESPECÍFICAS
      if (data.conectado && !data.pix_habilitado) {
        console.warn(
          "⚠️ Vendedor conectado mas PIX não habilitado:",
          data.detalhes?.erro_pix
        );
      }

      if (data.conectado && !data.split_habilitado) {
        console.warn("⚠️ Vendedor conectado mas split não habilitado");
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      setError("Erro ao verificar status do vendedor");
    } finally {
      setIsLoading(false);
    }
  };

  const conectarVendedor = async () => {
    try {
      // 1. Buscar link de conexão
      const response = await fetch(
        `http://localhost:3000/mercadopago/conectar/${vendedorId}`
      );
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      // 2. Abrir popup
      const popup = window.open(
        data.link_conexao,
        "mercadopago-auth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      // 3. Escutar resposta do callback
      const handleMessage = (event: MessageEvent) => {
        if (event.data.success) {
          console.log("✅ Conta conectada!");
          setVendedorConectado(true);
          popup?.close();
          // Recarregar status
          verificarStatusVendedor();
        } else {
          console.error("❌ Erro:", event.data.message);
          alert(`Erro ao conectar: ${event.data.message}`);
        }
        window.removeEventListener("message", handleMessage);
      };

      window.addEventListener("message", handleMessage);
    } catch (error) {
      console.error("Erro ao conectar:", error);
      alert(
        `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  };

  const onSubmit = async ({
    selectedPaymentMethod,
    formData,
  }: PaymentFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      // ✅ DEBUG: Verificar se token está sendo enviado
      console.log("🔍 Debug formData:", formData);
      console.log("🔍 Debug selectedPaymentMethod:", selectedPaymentMethod);
      console.log("🔍 Debug token:", formData.token);

      // ✅ VALIDAR SE TOKEN EXISTE
      if (!formData.token) {
        throw new Error(
          "Token de pagamento não foi gerado. Verifique os dados do cartão."
        );
      }

      // ✅ USAR SPLIT AUTOMÁTICO
      const paymentRequestData = {
        valor: 1.0,
        token: formData.token,
        descricao: "Camiseta Nike - Loja do Icaro",
        email_comprador: "compradorHAHA@test.com",
        installments: formData.installments || 1,
        // ✅ ADICIONAR payment_method_id também
        payment_method_id: formData.payment_method_id || selectedPaymentMethod,
        // ✅ DADOS DO SPLIT
        vendedor_id: vendedorId,
        comissao: 0.5, // R$ 0,50 de comissão
        produto_id: "produto-123",
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

        // ✅ VERIFICAR SE É ERRO DE TOKEN
        if (
          errorData.message?.includes("Token expirado") ||
          errorData.message?.includes("reconectar")
        ) {
          alert(
            "Token do vendedor expirado. É necessário reconectar a conta do Mercado Pago."
          );
          // Redirecionar para reconexão
          window.location.href = `/conectar-vendedor/${vendedorId}`;
          return;
        }

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
    console.error("❌ Erro detalhado no brick:", error);
    console.error("❌ Tipo do erro:", typeof error);
    console.error("❌ Stack do erro:", error.stack);
    setError(
      `Erro no sistema de pagamento: ${error.message || JSON.stringify(error)}`
    );
  };

  const onReady = async (): Promise<void> => {
    console.log("Brick pronto");
  };

  const resetPayment = () => {
    setPaymentStatus("");
    setError("");
    setPaymentData(null);
  };

  // Opção para PIX com QR Code direto
  const criarPixComQrCode = async () => {
    try {
      setIsLoading(true);

      const dadosPix = {
        valor: 1.0,
        descricao: "Camiseta Nike - Loja do Icaro",
        email_comprador: "compradorHAHA@test.com",
        vendedor_id: vendedorId,
        comissao: 0.5,
      };

      const response = await fetch(
        "http://localhost:3000/mercadopago/criar-pix-split",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosPix),
        }
      );

      const result = await response.json();

      if (result.success && result.qr_code) {
        setPaymentData(result);
        setPaymentStatus("pending_pix");
      } else {
        throw new Error("Erro ao gerar PIX");
      }
    } catch (error) {
      setError(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FUNÇÃO PARA PIX MANUAL
  const criarPixManual = async () => {
    try {
      setIsLoading(true);

      const dadosPix = {
        valor: 1.0,
        descricao: "Camiseta Nike - Loja do Icaro",
        email_comprador: "compradorHAHA@test.com",
        vendedor_id: vendedorId,
        comissao: 0.5,
      };

      // ✅ USAR ENDPOINT DE PIX MANUAL
      const response = await fetch(
        "http://localhost:3000/mercadopago/criar-pix-manual",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosPix),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.qr_code) {
        setPaymentData(result);
        setPaymentStatus("pending_pix");

        alert(
          "ℹ️ PIX criado! Valor será transferido manualmente para o vendedor após confirmação."
        );
      } else {
        throw new Error("Erro ao gerar PIX manual");
      }
    } catch (error) {
      setError(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ TELA PARA CONECTAR VENDEDOR
  if (!vendedorConectado && !isLoading) {
    return (
      <div className="mercado-pago-container">
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            border: "1px solid #ffeaa7",
          }}
        >
          <h2>🔗 Conectar Conta do Mercado Pago</h2>
          <p>
            Para processar pagamentos com split automático, o vendedor precisa
            conectar sua conta do Mercado Pago.
          </p>

          <div style={{ margin: "20px 0" }}>
            <p>
              <strong>Vendedor ID:</strong> {vendedorId}
            </p>
            <p>
              <strong>Status:</strong> Não conectado
            </p>
          </div>

          <button
            onClick={conectarVendedor}
            style={{
              padding: "15px 30px",
              backgroundColor: "#009EE3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔗 Conectar Mercado Pago
          </button>

          <div
            style={{ marginTop: "15px", fontSize: "14px", color: "#856404" }}
          >
            <p>✅ Split automático entre vendedor e plataforma</p>
            <p>✅ Vendedor recebe direto na conta</p>
            <p>✅ Plataforma recebe comissão automaticamente</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ TELA PARA VENDEDOR CONECTADO MAS COM LIMITAÇÕES (MOVER PARA AQUI)
  if (
    vendedorConectado &&
    vendedorInfo &&
    !vendedorInfo.pix_habilitado &&
    !showPaymentBrick
  ) {
    return (
      <div className="mercado-pago-container">
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            border: "1px solid #ffeaa7",
          }}
        >
          <h2 style={{ color: "#856404" }}>
            ⚠️ Conta Conectada com Limitações
          </h2>

          <div style={{ margin: "20px 0" }}>
            <p>
              <strong>Vendedor ID:</strong> {vendedorId}
            </p>
            <p>
              <strong>Status da Conta:</strong>{" "}
              {vendedorInfo.conta_ativa ? "✅ Ativa" : "❌ Inativa"}
            </p>
            <p>
              <strong>PIX Habilitado:</strong>{" "}
              {vendedorInfo.pix_habilitado ? "✅ Sim" : "❌ Não"}
            </p>
            <p>
              <strong>Split Habilitado:</strong>{" "}
              {vendedorInfo.split_habilitado ? "✅ Sim" : "❌ Não"}
            </p>
          </div>

          {/* ✅ DETALHES DO PROBLEMA */}
          {vendedorInfo.detalhes?.erro_pix && (
            <div
              style={{
                backgroundColor: "#f8d7da",
                padding: "15px",
                borderRadius: "8px",
                margin: "15px 0",
                border: "1px solid #f5c6cb",
              }}
            >
              <h4 style={{ color: "#721c24" }}>🚫 Problema com PIX:</h4>
              <p style={{ color: "#721c24" }}>
                {vendedorInfo.detalhes.erro_pix}
              </p>
            </div>
          )}

          {/* ✅ MÉTODOS DISPONÍVEIS */}
          {vendedorInfo.metodos_disponiveis &&
            vendedorInfo.metodos_disponiveis.length > 0 && (
              <div
                style={{
                  backgroundColor: "#e9ecef",
                  padding: "15px",
                  borderRadius: "8px",
                  margin: "15px 0",
                }}
              >
                <h4>💳 Métodos de Pagamento Disponíveis:</h4>
                <ul>
                  {vendedorInfo.metodos_disponiveis.map(
                    (metodo: any, index: number) => (
                      <li key={index}>
                        <strong>{metodo.id}</strong> - {metodo.name} (
                        {metodo.status})
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* ✅ OPÇÕES DISPONÍVEIS */}
          <div style={{ marginTop: "20px" }}>
            <h4>📱 Opções Disponíveis:</h4>

            {/* CARTÃO SEMPRE FUNCIONA */}
            <div style={{ marginBottom: "15px" }}>
              <button
                onClick={() => {
                  console.log("📱 Habilitando Payment Brick...");
                  setShowPaymentBrick(true); // ✅ MOSTRAR PAYMENT BRICK
                }}
                style={{
                  padding: "15px 25px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginRight: "10px",
                }}
              >
                💳 Pagar com Cartão (Split Manual)
              </button>
            </div>

            {/* PIX MANUAL SE NÃO TIVER AUTOMÁTICO */}
            {!vendedorInfo.pix_habilitado && (
              <div style={{ marginBottom: "15px" }}>
                <button
                  onClick={criarPixManual}
                  style={{
                    padding: "15px 25px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  📱 PIX (Split Manual)
                </button>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#856404",
                    marginTop: "5px",
                  }}
                >
                  ℹ️ PIX será processado na nossa conta e valor transferido
                  manualmente
                </p>
              </div>
            )}
          </div>

          {/* ✅ INFORMAÇÕES PARA O VENDEDOR */}
          <div
            style={{
              backgroundColor: "#cce5ff",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            <h4 style={{ color: "#004085" }}>
              ℹ️ Para Habilitar PIX Automático:
            </h4>
            <ol style={{ color: "#004085" }}>
              <li>Acesse sua conta do Mercado Pago</li>
              <li>Complete a verificação de identidade</li>
              <li>Habilite PIX nas configurações</li>
              <li>Reconecte sua conta aqui</li>
            </ol>
          </div>

          <button
            onClick={() => {
              setVendedorConectado(false);
              setVendedorInfo(null);
            }}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            🔄 Reconectar Conta
          </button>
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
              <strong>Produto:</strong> Camiseta Nike - Loja do Icaro
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
                {paymentData?.comissao_plataforma?.toFixed(2)}
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

  // ✅ TELA DE PIX PENDENTE COM QR CODE
  if (paymentStatus === "pending_pix") {
    return (
      <div className="mercado-pago-container">
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#fff3cd",
            borderRadius: "8px",
            border: "1px solid #ffeaa7",
          }}
        >
          <h2 style={{ color: "#856404" }}>📱 Pagamento PIX</h2>

          <div style={{ margin: "20px 0" }}>
            <p>
              <strong>Produto:</strong> Camiseta Nike - Loja do Icaro
            </p>
            <p>
              <strong>Valor:</strong> R$ {paymentData?.valor_total?.toFixed(2)}
            </p>
            <p>
              <strong>ID do Pagamento:</strong> {paymentData?.payment_id}
            </p>
          </div>

          {/* ✅ QR CODE */}
          {paymentData?.qr_code_base64 && (
            <div style={{ margin: "20px 0" }}>
              <h3>📱 Escaneie o QR Code:</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "15px 0",
                }}
              >
                <img
                  src={`data:image/png;base64,${paymentData.qr_code_base64}`}
                  alt="QR Code PIX"
                  style={{
                    maxWidth: "250px",
                    border: "2px solid #32bcad",
                    borderRadius: "8px",
                    padding: "15px",
                    backgroundColor: "white",
                  }}
                />
              </div>
              <p style={{ fontSize: "14px", color: "#856404" }}>
                ✅ Abra seu app do banco e escaneie o código
              </p>
            </div>
          )}

          {/* ✅ COPIA E COLA */}
          {paymentData?.qr_code && (
            <div style={{ margin: "20px 0" }}>
              <h4>💳 Ou copie o código PIX:</h4>
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                  fontSize: "12px",
                  wordBreak: "break-all",
                  maxHeight: "120px",
                  overflow: "auto",
                  margin: "10px 0",
                  fontFamily: "monospace",
                }}
              >
                {paymentData.qr_code}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentData.qr_code);
                  alert("✅ Código PIX copiado para a área de transferência!");
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#32bcad",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                📋 Copiar Código PIX
              </button>
            </div>
          )}

          {/* ✅ INFORMAÇÕES DO SPLIT */}
          <div
            style={{
              backgroundColor: "#e9ecef",
              padding: "15px",
              borderRadius: "8px",
              margin: "15px 0",
            }}
          >
            <h4>💰 Split Automático:</h4>
            <p>
              <strong>🏪 Vendedor receberá:</strong> R${" "}
              {paymentData?.valor_vendedor?.toFixed(2)}
            </p>
            <p>
              <strong>🏢 Comissão plataforma:</strong> R${" "}
              {paymentData?.comissao_plataforma?.toFixed(2)}
            </p>
            <p style={{ fontSize: "12px", color: "#666" }}>
              ✅ Divisão automática após confirmação do pagamento
            </p>
          </div>

          {/* ✅ INFORMAÇÕES ADICIONAIS */}
          <div
            style={{ marginTop: "20px", fontSize: "14px", color: "#856404" }}
          >
            <p>⏰ O PIX expira em 30 minutos</p>
            <p>🚀 Confirmação instantânea após o pagamento</p>
            <p>🔔 Você será notificado quando o pagamento for confirmado</p>
          </div>

          {/* ✅ BOTÕES DE AÇÃO */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={resetPayment}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              ← Voltar
            </button>

            <button
              onClick={verificarStatusVendedor}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🔄 Verificar Status
            </button>
          </div>
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

  // ✅ VERSÃO SIMPLIFICADA - SEMPRE MOSTRAR CARTÃO QUANDO CONECTADO
  // ✅ TELA PRINCIPAL DE PAGAMENTO (VENDEDOR CONECTADO)
  if (vendedorConectado || showPaymentBrick) {
    return (
      <div className="mercado-pago-container">
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h2>Finalizar Compra</h2>

            {/* ✅ STATUS DINÂMICO */}
            <div
              style={{
                backgroundColor: vendedorInfo?.pix_habilitado
                  ? "#d4edda"
                  : "#fff3cd",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              {vendedorInfo?.pix_habilitado
                ? "✅ Split automático disponível"
                : "⚠️ Split manual - PIX/Cartão processados na conta principal"}
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
                R$ 1,00
              </p>
              <div style={{ fontSize: "12px", color: "#6c757d" }}>
                <p>💰 Vendedor recebe: R$ 0,50</p>
                <p>🏢 Comissão plataforma: R$ 0,50 (50%)</p>
              </div>
            </div>
          </div>

          {/* ✅ PIX SEMPRE DISPONÍVEL */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h3>Escolha como pagar:</h3>

            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <button
                onClick={criarPixComQrCode}
                disabled={isLoading}
                style={{
                  padding: "15px 25px",
                  backgroundColor: "#32bcad",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  minWidth: "180px",
                }}
              >
                {isLoading ? "Gerando..." : "📱 Pagar com PIX"}
              </button>
            </div>
          </div>

          {/* ✅ PAYMENT BRICK SEMPRE RENDERIZADO */}
          <div
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
              💳 Ou pague com cartão:
            </h4>

            <Payment
              initialization={{ amount: 1.0 }}
              customization={customization}
              onSubmit={onSubmit}
              onReady={onReady}
              onError={onError}
            />
          </div>
        </div>
      </div>
    );
  }

  // ✅ FALLBACK - SE NADA SE APLICA, MOSTRAR LOADING
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

  // ✅ SE CHEGOU AQUI, ALGO DEU ERRADO - DEBUG
  return (
    <div className="mercado-pago-container">
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>🔧 Debug - Estado Atual:</h2>
        <pre
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          {JSON.stringify(
            {
              vendedorConectado,
              isLoading,
              error,
              paymentStatus,
              showPaymentBrick,
              vendedorInfo: vendedorInfo
                ? {
                    pix_habilitado: vendedorInfo.pix_habilitado,
                    conta_ativa: vendedorInfo.conta_ativa,
                  }
                : null,
            },
            null,
            2
          )}
        </pre>
        <button onClick={() => window.location.reload()}>🔄 Recarregar</button>
      </div>
    </div>
  );
}; // ✅ FECHAR A FUNÇÃO AQUI

export default MercadoPagoPIX;
