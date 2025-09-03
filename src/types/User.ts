export interface IUser {
  contact: string;
  cpf: string;
  email: string;
  id: number;
  seller?: boolean;
  instagram: string;
  name: string;
  token?: string;
  mp_access_token?: string;
  mp_conectado?: boolean;
  mp_conectado_em?: string;
  mp_refresh_token?: string;
  mp_token_expira_em?: string | null;
}
