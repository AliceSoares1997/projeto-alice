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
import { FornecedorModal } from "@/components/FornecedorModal";
import { Fornecedor } from "@/interfaces/fornecedor";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertaConfirmacao } from "@/components/AlertaConfirmacao";
import { EyeIcon, Edit2Icon, Trash2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FornecedorDetalhesModal } from "@/components/FornecedorDetalhesModal";
import { api } from "@/services/api";
import { mostrarToast } from "@/components/ToastPersonalizado";
export default function ListarFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [fornecedorSelecionado, setFornecedorSelecionado] =
    useState<Fornecedor | null>(null);
  const [alertaExclusaoAberto, setAlertaExclusaoAberto] = useState(false);
  const [fornecedorParaExcluir, setFornecedorParaExcluir] = useState<
    number | null
  >(null);
  const [fornecedorParaEditar, setFornecedorParaEditar] =
    useState<Fornecedor | null>(null);

  async function fetchFornecedores() {
    try {
      const response = await api.get("/fornecedor");
      const data = await response.json();
      setFornecedores(data);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const handleFornecedorCriado = (fornecedor: Fornecedor) => {
    setFornecedores((prev) => [...prev, fornecedor]);
    fetchFornecedores();
  };

  const handleFornecedorAtualizado = (fornecedor: Fornecedor) => {
    setFornecedores((prev) =>
      prev.map((f) => (f.id === fornecedor.id ? fornecedor : f))
    );
    setFornecedorParaEditar(null);
  };

  const handleEditarClick = (fornecedor: Fornecedor) => {
    setFornecedorParaEditar(fornecedor);
    setModalAberto(true);
  };

  const handleExcluirClick = (id: number) => {
    setFornecedorParaExcluir(id);
    setAlertaExclusaoAberto(true);
  };

  const handleConfirmarExclusao = async () => {
    if (fornecedorParaExcluir) {
      try {
        const response = await api.delete(
          `/fornecedor/${fornecedorParaExcluir}`
        );

        if (response.ok) {
          setFornecedores(
            fornecedores.filter((f) => f.id !== fornecedorParaExcluir)
          );
          mostrarToast({
            mensagem: "Fornecedor excluído com sucesso",
            descricao: "O fornecedor foi excluído com sucesso",
            tipo: "sucesso",
            posicao: "top-right",
          });
        } else {
          console.error("Erro ao excluir fornecedor");
          mostrarToast({
            mensagem: "Erro ao excluir fornecedor",
            descricao: "Ocorreu um erro ao excluir o fornecedor",
            tipo: "erro",
            posicao: "top-right",
          });
        }
      } catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
        mostrarToast({
          mensagem: "Erro ao excluir fornecedor",
          descricao: "Ocorreu um erro ao excluir o fornecedor",
          tipo: "erro",
          posicao: "top-right",
        });
      }
    }
  };

  const handleVisualizarDetalhes = (fornecedor: Fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setModalDetalhesAberto(true);
  };

  return (
    <div className="container mx-auto ">
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row">
        <h1 className="text-2xl font-bold text-blue-700">
          Lista de Fornecedores
        </h1>
        <div className="flex gap-4 items-center flex-col md:flex-row">
          <Link
            to="/produtos"
            className="px-5 h-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center"
          >
            Ver Produtos
          </Link>
          <Button
            className="px-5 h-10 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md rounded-md cursor-pointer"
            onClick={() => {
              setModalAberto(true);
              setFornecedorParaEditar(null);
            }}
            variant="default"
          >
            Novo Fornecedor
          </Button>
        </div>
      </div>

      <FornecedorModal
        aberto={modalAberto}
        setAberto={setModalAberto}
        onFornecedorCriado={handleFornecedorCriado}
        fornecedorParaEditar={fornecedorParaEditar}
        onFornecedorAtualizado={handleFornecedorAtualizado}
      />

      {fornecedorSelecionado && (
        <FornecedorDetalhesModal
          aberto={modalDetalhesAberto}
          setAberto={setModalDetalhesAberto}
          fornecedor={fornecedorSelecionado}
        />
      )}

      <AlertaConfirmacao
        aberto={alertaExclusaoAberto}
        setAberto={setAlertaExclusaoAberto}
        titulo="Confirmar exclusão"
        descricao="Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita."
        onConfirmar={handleConfirmarExclusao}
        textoBotaoConfirmar="Excluir"
        textoBotaoCancelar="Cancelar"
        variante="perigo"
      />

      <Table>
        <TableCaption>Lista de fornecedores cadastrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-36" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                  </TableRow>
                ))
            : fornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleVisualizarDetalhes(fornecedor)}
                            className="p-2 rounded-full hover:bg-gray-100 inline-flex cursor-pointer"
                          >
                            <EyeIcon className="w-4 h-4 text-blue-600" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visualizar detalhes</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="font-medium">{fornecedor.id}</TableCell>
                  <TableCell>{fornecedor.nome}</TableCell>
                  <TableCell>{fornecedor.cnpj}</TableCell>
                  <TableCell>{fornecedor.contatoPrincipal}</TableCell>
                  <TableCell>{fornecedor.email}</TableCell>
                  <TableCell>{fornecedor.ativo ? "Sim" : "Não"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleEditarClick(fornecedor)}
                              className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-all duration-200 inline-flex items-center cursor-pointer"
                            >
                              <Edit2Icon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar fornecedor</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => handleExcluirClick(fornecedor.id)}
                              className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-all duration-200 inline-flex items-center cursor-pointer"
                            >
                              <Trash2Icon className="w-4 h-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Excluir fornecedor</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
