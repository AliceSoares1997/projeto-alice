import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertaConfirmacao } from "@/components/AlertaConfirmacao";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Produto } from "@/interfaces/produto";
import { PlusIcon } from "lucide-react";
import { ProdutoModal } from "@/components/ProdutoModal";
import { mostrarToast } from "@/components/ToastPersonalizado";
import { ProdutoFornecedoresModal } from "@/components/ProdutoFornecedoresModal";
import { api } from "@/services/api";

export default function ListarProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertaExclusaoAberto, setAlertaExclusaoAberto] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<number | null>(
    null
  );
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(
    null
  );
  const [modalFornecedoresAberto, setModalFornecedoresAberto] = useState(false);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<
    number | null
  >(null);

  const fetchProdutos = async () => {
    try {
      const response = await api.get("/produto");
      const data = await response.json();

      const produtosFormatados = [];
      for (const produto of data) {
        // Foormatar para se enquadrar no padrão "2025-03-22"
        if (produto.data_validade) {
          const dataValidade = new Date(produto.data_validade);
          const dataValidadeFormatada = dataValidade
            .toISOString()
            .split("T")[0];
          produto.data_validade = dataValidadeFormatada;
        } else {
          produto.data_validade = "";
        }
        produtosFormatados.push(produto);
      }

      setProdutos(produtosFormatados);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      mostrarToast({
        mensagem: "Erro ao carregar produtos",
        descricao: "Ocorreu um erro ao carregar os produtos",
        tipo: "erro",
        posicao: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleExcluirClick = (id: number) => {
    setProdutoParaExcluir(id);
    setAlertaExclusaoAberto(true);
  };

  const handleConfirmarExclusao = async () => {
    if (produtoParaExcluir) {
      try {
        const response = await api.delete(`/produto/${produtoParaExcluir}`);
        if (response.ok) {
          setProdutos(produtos.filter((p) => p.id !== produtoParaExcluir));
          mostrarToast({
            mensagem: "Produto excluído com sucesso",
            tipo: "sucesso",
            posicao: "top-right",
          });
        }
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        mostrarToast({
          mensagem: "Erro ao excluir produto",
          tipo: "erro",
          posicao: "top-right",
        });
      }
    }
  };

  const handleNovoProduto = () => {
    setProdutoParaEditar(null);
    setModalAberto(true);
  };

  const handleEditarProduto = (produto: Produto) => {
    // Verificar se a data do produto esta no padrao "2025-03-02T00:00:00.000Z"
    // Se tiver, converter para o padrão "2025-03-02"
    if (produto.data_validade) {
      const dataValidade = new Date(produto.data_validade);
      produto.data_validade = dataValidade.toISOString().split("T")[0];
    }
    setProdutoParaEditar(produto);
    setModalAberto(true);
  };

  const handleProdutoCriado = (produto: Produto) => {
    console.log("produtoCriado", produto);
    setProdutos((prev) => [...prev, produto]);
  };

  const handleProdutoAtualizado = (produtoAtualizado: Produto) => {
    setProdutos((prev) =>
      prev.map((p) => (p.id === produtoAtualizado.id ? produtoAtualizado : p))
    );
  };

  const handleAbrirModalFornecedores = (id: number) => {
    setProdutoSelecionadoId(id);
    setModalFornecedoresAberto(true);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
        <h1 className="text-2xl font-bold text-blue-700">Lista de Produtos</h1>
        <div className="flex gap-4 items-center flex-col md:flex-row">
          <Link
            to="/fornecedores"
            className="px-5 h-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center"
          >
            Ver Fornecedores
          </Link>
          <Button
            onClick={handleNovoProduto}
            className="px-5 h-10 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      <AlertaConfirmacao
        aberto={alertaExclusaoAberto}
        setAberto={setAlertaExclusaoAberto}
        titulo="Confirmar exclusão"
        descricao="Tem certeza que deseja excluir este produto?"
        onConfirmar={handleConfirmarExclusao}
        textoBotaoConfirmar="Excluir"
        textoBotaoCancelar="Cancelar"
        variante="perigo"
      />

      <Table>
        <TableCaption>Lista de produtos cadastrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="w-[14px]">ID</TableHead>
            <TableHead>Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Código de Barras</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array(8)
                      .fill(0)
                      .map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            : produtos.map((produto) => (
                <TableRow key={produto.id}>
                  {/* Olho que vai abrir um modal com os fornecedores vinculados ao produto */}
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              handleAbrirModalFornecedores(produto.id)
                            }
                            className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 cursor-pointer"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Associar fornecedores</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="font-medium">{produto.id}</TableCell>
                  <TableCell>
                    {produto.produto_imagem ? (
                      <img
                        src={produto.produto_imagem}
                        alt={produto.nome}
                        className="w-10 h-10 rounded-md object-cover bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() =>
                          window.open(produto.produto_imagem, "_blank")
                        }
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "https://placehold.co/40x40/e2e8f0/64748b?text=Produto";
                          target.onerror = null;
                        }}
                      />
                    ) : (
                      <img
                        src="https://placehold.co/40x40/e2e8f0/64748b?text=Produto"
                        alt={produto.nome}
                        className="w-10 h-10 rounded-md object-cover bg-gray-100"
                      />
                    )}
                  </TableCell>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>{produto.codigo_barras}</TableCell>
                  <TableCell>{produto.estoque}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleEditarProduto(produto)}
                              className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 cursor-pointer"
                            >
                              <Edit2Icon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar produto</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleExcluirClick(produto.id)}
                              className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 cursor-pointer"
                            >
                              <Trash2Icon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir produto</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <ProdutoModal
        aberto={modalAberto}
        setAberto={setModalAberto}
        onProdutoCriado={handleProdutoCriado}
        produtoParaEditar={produtoParaEditar}
        onProdutoAtualizado={handleProdutoAtualizado}
      />

      <ProdutoFornecedoresModal
        aberto={modalFornecedoresAberto}
        setAberto={setModalFornecedoresAberto}
        produtoId={produtoSelecionadoId}
      />
    </div>
  );
}
