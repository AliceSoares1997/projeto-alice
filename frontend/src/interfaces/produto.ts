import { Fornecedor } from "./fornecedor";

export interface Produto {
  id: number;
  nome: string;
  codigo_barras: string;
  descricao: string;
  estoque: number;
  categoria: string;
  data_validade: string;
  produto_imagem: string;
  fornecedores?: (Fornecedor & { idVinculo: number | null })[];
}
