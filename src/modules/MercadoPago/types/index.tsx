export interface paymentRequestData {
  valor: number;
  token: string;
  descricao: string;
  email_comprador: string;
  installments: number;
  // ✅ ADICIONAR payment_method_id também
  payment_method_id: string;
  // ✅ DADOS DO SPLIT
  vendedor_id: string;
  comissao: number;
  produto_id: string;
}

export interface statusResponseData {
  conectado: boolean;
  link_conexao: null | string;
  message: string;
  success: boolean;
}

export interface connectResponseData {
  link_conexao: string;
  message: string;
  success: boolean;
}

export interface processPaymentResponse {
  success: boolean;
  payment_id: number;
  external_reference: string;
  status: string;
  valor_total: number;
  comissao_plataforma: number;
  valor_vendedor: number;
  response: ResponseProcess;
  qr_code?: string;
  qr_code_base64?: string;
}

export interface ResponseProcess {
  id: number;
  date_created: Date;
  date_approved: Date;
  date_last_updated: Date;
  date_of_expiration: null;
  money_release_date: Date;
  money_release_status: string;
  operation_type: string;
  issuer_id: string;
  payment_method_id: string;
  payment_type_id: string;
  status: string;
  status_detail: string;
  currency_id: string;
  description: string;
  live_mode: boolean;
  sponsor_id: null;
  authorization_code: string;
  money_release_schema: null;
  taxes_amount: number;
  counter_currency: null;
  brand_id: null;
  shipping_amount: number;
  build_version: string;
  pos_id: null;
  store_id: null;
  integrator_id: null;
  platform_id: null;
  corporation_id: null;
  collector_id: number;
  marketplace_owner: null;
  external_reference: string;
  transaction_amount: number;
  transaction_amount_refunded: number;
  coupon_amount: number;
  differential_pricing_id: null;
  financing_group: null;
  deduction_schema: null;
  installments: number;
  captured: boolean;
  binary_mode: boolean;
  call_for_authorize_id: null;
  statement_descriptor: string;
  notification_url: string;
  processing_mode: string;
  merchant_account_id: null;
  merchant_number: null;
  accounts_info: null;
  release_info: null;
  tags: null;
}

export interface PixRequestData {
  valor: number;
  descricao: string;
  email_comprador: string;
  vendedor_id: string;
  comissao: number;
}

export interface StatusPixResponseData {
  payment_id: string;
  status_banco: string;
  status_mp: string;
  success: boolean;
}
