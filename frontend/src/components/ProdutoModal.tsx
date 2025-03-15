import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Produto } from "@/interfaces/produto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mostrarToast } from "./ToastPersonalizado";

interface ProdutoModalProps {
  aberto: boolean;
  setAberto: (aberto: boolean) => void;
  onProdutoCriado: (produto: Produto) => void;
  produtoParaEditar?: Produto | null;
  onProdutoAtualizado?: (produto: Produto) => void;
}

export function ProdutoModal({
  aberto,
  setAberto,
  onProdutoCriado,
  produtoParaEditar,
  onProdutoAtualizado,
}: ProdutoModalProps) {
  const [novoProduto, setNovoProduto] = useState<Omit<Produto, "id">>({
    nome: "",
    codigo_barras: "",
    descricao: "",
    estoque: 0,
    categoria: "",
    data_validade: "",
    produto_imagem: "",
  });

  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState(false);
  const categoriasPredefinidas = [
    "Eletrônicos",
    "Alimentos",
    "Vestuário",
    "Outro",
  ];

  const modoEdicao = !!produtoParaEditar;

  useEffect(() => {
    if (produtoParaEditar) {
      setNovoProduto({
        nome: produtoParaEditar.nome,
        codigo_barras: produtoParaEditar.codigo_barras,
        descricao: produtoParaEditar.descricao,
        estoque: produtoParaEditar.estoque,
        categoria: produtoParaEditar.categoria,
        data_validade: produtoParaEditar.data_validade,
        produto_imagem: produtoParaEditar.produto_imagem,
      });
      setCategoriaPersonalizada(
        !categoriasPredefinidas.includes(produtoParaEditar.categoria)
      );
    } else {
      setNovoProduto({
        nome: "",
        codigo_barras: "",
        descricao: "",
        estoque: 0,
        categoria: "",
        data_validade: "",
        produto_imagem: "",
      });
      setCategoriaPersonalizada(false);
    }
  }, [produtoParaEditar, aberto]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === "number" ? Number(value) : value;
    setNovoProduto((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novoProduto.nome || !novoProduto.descricao || !novoProduto.categoria) {
      mostrarToast({
        mensagem: "Preencha todos os campos obrigatórios",
        tipo: "erro",
        posicao: "top-center",
      });
      return;
    }

    try {
      const url = modoEdicao
        ? `${import.meta.env.VITE_API_URL}/produto/${produtoParaEditar.id}`
        : `${import.meta.env.VITE_API_URL}/produto`;

      const dadosParaEnviar: Partial<typeof novoProduto> = { ...novoProduto };
      if (dadosParaEnviar.data_validade === "") {
        delete dadosParaEnviar.data_validade;
      }

      const response = await fetch(url, {
        method: modoEdicao ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnviar),
      });

      const produtoResult = await response.json();
      if (response.ok) {
        if (modoEdicao && onProdutoAtualizado) {
          onProdutoAtualizado(produtoResult);
          mostrarToast({
            mensagem: "Produto atualizado com sucesso",
            tipo: "sucesso",
            posicao: "top-center",
          });
        } else {
          onProdutoCriado(produtoResult);
          mostrarToast({
            mensagem: "Produto cadastrado com sucesso!",
            tipo: "sucesso",
            posicao: "top-center",
          });
        }
        setAberto(false);
      } else if (response.status === 409) {
        /**
         * Deu algum erro de conflito com o banco de dados
         * Exemplo: Código de barras já cadastrado
         */
        mostrarToast({
          mensagem: produtoResult.message,
          tipo: "erro",
          posicao: "top-center",
        });
      }
    } catch (error) {
      console.error("Erro ao criar ou atualizar produto:", error);
      mostrarToast({
        mensagem: `Erro ao ${modoEdicao ? "atualizar" : "criar"} produto`,
        tipo: "erro",
        posicao: "top-center",
      });
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {modoEdicao ? "Editar Produto" : "Adicionar Produto"}
            </DialogTitle>
            <DialogDescription>
              {modoEdicao
                ? "Atualize os dados do produto"
                : "Preencha os dados do novo produto"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={novoProduto.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="codigo_barras">Código de Barras</Label>
                <Input
                  id="codigo_barras"
                  name="codigo_barras"
                  value={novoProduto.codigo_barras}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  name="descricao"
                  value={novoProduto.descricao}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="estoque">Estoque</Label>
                <Input
                  id="estoque"
                  name="estoque"
                  type="number"
                  value={novoProduto.estoque}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="categoria">Categoria</Label>
                {!categoriaPersonalizada ? (
                  <Select
                    value={novoProduto.categoria}
                    onValueChange={(valor) => {
                      if (valor === "Outro") {
                        setCategoriaPersonalizada(true);
                        setNovoProduto((prev) => ({ ...prev, categoria: "" }));
                      } else {
                        setNovoProduto((prev) => ({
                          ...prev,
                          categoria: valor,
                        }));
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasPredefinidas.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="categoria"
                      name="categoria"
                      value={novoProduto.categoria}
                      onChange={handleInputChange}
                      placeholder="Digite a categoria"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCategoriaPersonalizada(false)}
                    >
                      Voltar
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="data_validade">Data de Validade</Label>
                <Input
                  id="data_validade"
                  name="data_validade"
                  type="date"
                  value={novoProduto.data_validade}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="produto_imagem">URL da Imagem</Label>
                <Input
                  id="produto_imagem"
                  name="produto_imagem"
                  value={novoProduto.produto_imagem}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAberto(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
