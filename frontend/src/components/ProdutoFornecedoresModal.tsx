/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Building2, Package, Plus, Trash2 } from "lucide-react";
import { Fornecedor } from "@/interfaces/fornecedor";
import { mostrarToast } from "@/components/ToastPersonalizado";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/services/api";

// {
//   cadastrou: number[];
//   naoCadastrou: { id: number; mensagem: string }[];
// }

interface ProdutoFornecedoresModalProps {
  aberto: boolean;
  setAberto: (aberto: boolean) => void;
  produtoId: number | null;
}

export function ProdutoFornecedoresModal({
  aberto,
  setAberto,
  produtoId,
}: ProdutoFornecedoresModalProps) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [modoAssociacao, setModoAssociacao] = useState(false);
  const [fornecedoresDisponiveis, setFornecedoresDisponiveis] = useState<
    Fornecedor[]
  >([]);
  const [loadingFornecedores, setLoadingFornecedores] = useState(false);
  const [termoBusca, _] = useState("");
  const [associando, setAssociando] = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const [fornecedorParaRemover, setFornecedorParaRemover] =
    useState<Fornecedor | null>(null);
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);

  useEffect(() => {
    if (aberto && produtoId) {
      buscarInformacoesDoProduto();
    }
  }, [aberto, produtoId]);

  const buscarInformacoesDoProduto = async () => {
    if (!produtoId) return;

    setLoading(true);
    try {
      const response = await api.get(`/produto/${produtoId}`);
      if (!response.ok) throw new Error("Falha ao buscar fornecedores");
      const data = await response.json();
      setFornecedores(data.fornecedores);
      setNomeProduto(data.nome);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      mostrarToast({
        mensagem: "Erro ao carregar fornecedores",
        tipo: "erro",
        posicao: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarFornecedoresDisponiveis = async () => {
    setLoadingFornecedores(true);
    try {
      const response = await api.get(`/fornecedor?termo=${termoBusca}`);
      if (!response.ok)
        throw new Error("Falha ao buscar fornecedores disponíveis");
      const data = await response.json();

      const fornecedoresNaoAssociados = data.filter(
        (f: Fornecedor) => !fornecedores.some((atual) => atual.id === f.id)
      );

      setFornecedoresDisponiveis(fornecedoresNaoAssociados);
    } catch (error) {
      console.error("Erro ao buscar fornecedores disponíveis:", error);
      mostrarToast({
        mensagem: "Erro ao carregar fornecedores disponíveis",
        tipo: "erro",
        posicao: "top-right",
      });
    } finally {
      setLoadingFornecedores(false);
    }
  };

  const associarFornecedor = async (fornecedorId: number) => {
    if (!produtoId) return;

    setAssociando(true);
    try {
      const response = await api.post(
        `/produto/${produtoId}/fornecedor`,
        {
          fornecedores: [fornecedorId],
        }
      );

      const data = await response.json();
      if (response.ok) {
        mostrarToast({
          mensagem: "Fornecedor associado com sucesso",
          tipo: "sucesso",
          posicao: "top-right",
        });

        await buscarInformacoesDoProduto();
        setModoAssociacao(false);
      } else if (response.status === 409) {
        mostrarToast({
          mensagem: data.message,
          tipo: "erro",
          posicao: "top-right",
        });
      }
    } catch (error) {
      console.error("Erro ao associar fornecedor:", error);
      mostrarToast({
        mensagem: "Erro ao associar fornecedor",
        tipo: "erro",
        posicao: "top-right",
      });
    } finally {
      setAssociando(false);
    }
  };

  const confirmarRemocao = (fornecedor: Fornecedor) => {
    setFornecedorParaRemover(fornecedor);
    setModalConfirmacaoAberto(true);
  };

  const executarRemocao = async () => {
    if (!fornecedorParaRemover || !produtoId) return;

    setRemovendo(true);
    try {
      const response = await api.delete(
        `/produto/${produtoId}/fornecedor/${fornecedorParaRemover.id}`
      );

      if (response.ok) {
        mostrarToast({
          mensagem: "Associação removida com sucesso",
          tipo: "sucesso",
          posicao: "top-right",
        });
        await buscarInformacoesDoProduto();
      } else {
        const data = await response.json();
        mostrarToast({
          mensagem: data.message || "Erro ao remover associação",
          tipo: "erro",
          posicao: "top-right",
        });
      }
    } catch (error) {
      console.error("Erro ao remover associação:", error);
      mostrarToast({
        mensagem: "Erro ao remover associação",
        tipo: "erro",
        posicao: "top-right",
      });
    } finally {
      setRemovendo(false);
      setModalConfirmacaoAberto(false);
      setFornecedorParaRemover(null);
    }
  };

  useEffect(() => {
    if (modoAssociacao) {
      buscarFornecedoresDisponiveis();
    }
  }, [modoAssociacao, termoBusca]);

  return (
    <>
      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-lg [&>button]:hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold mb-1">
                  {modoAssociacao
                    ? "Associar Fornecedor"
                    : "Fornecedores do Produto"}
                </DialogTitle>
                <div className="flex items-center space-x-2 text-emerald-100">
                  <Package className="h-4 w-4" />
                  <span>{nomeProduto}</span>
                </div>
              </div>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </div>

          <div className="p-6">
            {modoAssociacao ? (
              <>
                {/* <div className="mb-4 relative">
                  <Input
                    placeholder="Buscar fornecedores..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                </div> */}

                {loadingFornecedores ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : fornecedoresDisponiveis.length > 0 ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {fornecedoresDisponiveis.map((fornecedor) => (
                      <div
                        key={fornecedor.id}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="bg-emerald-100 p-2 rounded-full mr-4">
                          <Building2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{fornecedor.nome}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{fornecedor.cnpj}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => associarFornecedor(fornecedor.id)}
                          disabled={associando}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          size="sm"
                        >
                          Associar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">
                      Nenhum fornecedor disponível encontrado
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button
                    onClick={() => setModoAssociacao(false)}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Voltar
                  </Button>
                </div>
              </>
            ) : (
              <>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : fornecedores.length > 0 ? (
                  <div className="space-y-4">
                    {fornecedores.map((fornecedor) => (
                      <div
                        key={fornecedor.id}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="bg-emerald-100 p-2 rounded-full mr-4">
                          <Building2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{fornecedor.nome}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>{fornecedor.cnpj}</span>
                            <span className="mx-2">•</span>
                            <span>{fornecedor.telefone}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div>
                            {fornecedor.ativo ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inativo
                              </span>
                            )}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => confirmarRemocao(fornecedor)}
                                  disabled={removendo}
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remover associação</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">
                      Este produto não possui fornecedores cadastrados
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button
                    onClick={() => setModoAssociacao(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Associar Fornecedor
                  </Button>
                  <Button
                    onClick={() => setAberto(false)}
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Fechar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalConfirmacaoAberto}
        onOpenChange={setModalConfirmacaoAberto}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar remoção</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover a associação com o fornecedor{" "}
              <span className="font-semibold">
                {fornecedorParaRemover?.nome}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalConfirmacaoAberto(false)}
              disabled={removendo}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={executarRemocao}
              disabled={removendo}
              className="bg-red-600 hover:bg-red-700"
            >
              {removendo ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
