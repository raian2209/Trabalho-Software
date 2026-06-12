export type Role = "ROLE_ADMIN" | "ROLE_FORNECEDOR" | "ROLE_USUARIO";
export type User = {
  id: string;
  nome: string;
  email: string;
  role: Role;
};
export type CouponType = "PERCENTAGEM" | "FIXO";
export type Coupon = {
  id: string;
  codigo: string;
  valorDesconto: number;
  tipoDesconto: CouponType;
  dataValidade: string;
};
export type Product = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  precoNovo: number;
  estoque: number;
  imagem: string;
  deleted: boolean;
};
export type OrderStatus =
  | "PENDENTE"
  | "PROCESSANDO"
  | "APROVADO"
  | "CONCLUIDO"
  | "ENVIADO"
  | "ENTREGUE"
  | "CANCELADO";

export type OrderItem = {
  id: string;
  status: OrderStatus;
};

export type Order = {
  id: string;
  pedidoId: string;
  nomeProduto: string;
  cliente: string;
  clienteNome: string;
  itens: OrderItem[];
  quantidade: number;
  data: string;
  dataVenda: string;
  dataPedido: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
};
