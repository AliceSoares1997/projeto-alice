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
import { Fornecedor } from "@/interfaces/fornecedor";
import { mostrarToast } from "./ToastPersonalizado";

interface FornecedorModalProps {
  aberto: boolean;
  setAberto: (aberto: boolean) => void;
  onFornecedorCriado: (fornecedor: Fornecedor) => void;
  fornecedorParaEditar?: Fornecedor | null;
  onFornecedorAtualizado?: (fornecedor: Fornecedor) => void;
}

export function FornecedorModal({
  aberto,
  setAberto,
  onFornecedorCriado,
  fornecedorParaEditar,
  onFornecedorAtualizado,
}: FornecedorModalProps) {
  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    cnpj: "",
    contato_principal: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  const modoEdicao = !!fornecedorParaEditar;

  useEffect(() => {
    if (fornecedorParaEditar) {
      setNovoFornecedor({
        nome: fornecedorParaEditar.nome || "",
        cnpj: fornecedorParaEditar.cnpj || "",
        contato_principal: fornecedorParaEditar.contatoPrincipal || "",
        telefone: fornecedorParaEditar.telefone || "",
        email: fornecedorParaEditar.email || "",
        endereco: fornecedorParaEditar.endereco || "",
      });
    } else {
      setNovoFornecedor({
        nome: "",
        cnpj: "",
        contato_principal: "",
        telefone: "",
        email: "",
        endereco: "",
      });
    }
  }, [fornecedorParaEditar, aberto]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name === "cnpj") {
      const cnpjValue = value.replace(/\D/g, "");
      if (cnpjValue.length <= 14) {
        const maskedCnpj = formatCnpj(cnpjValue);
        setNovoFornecedor((prev) => ({
          ...prev,
          [name]: maskedCnpj,
        }));
      }
    } else if (name === "telefone") {
      const telefoneValue = value.replace(/\D/g, "");
      if (telefoneValue.length <= 11) {
        const maskedTelefone = formatTelefone(telefoneValue);
        setNovoFornecedor((prev) => ({
          ...prev,
          [name]: maskedTelefone,
        }));
      }
    } else {
      setNovoFornecedor((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const formatCnpj = (value: string): string => {
    if (!value) return "";

    value = value.replace(/\D/g, "");

    if (value.length <= 2) {
      return value;
    } else if (value.length <= 5) {
      return `${value.slice(0, 2)}.${value.slice(2)}`;
    } else if (value.length <= 8) {
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
    } else if (value.length <= 12) {
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
        5,
        8
      )}/${value.slice(8)}`;
    } else {
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
        5,
        8
      )}/${value.slice(8, 12)}-${value.slice(12, 14)}`;
    }
  };

  const formatTelefone = (value: string): string => {
    if (!value) return "";

    value = value.replace(/\D/g, "");

    if (value.length <= 2) {
      return `(${value}`;
    } else if (value.length <= 6) {
      return `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length <= 10) {
      // Telefone fixo
      return `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else {
      // Celular
      return `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = modoEdicao
        ? `${import.meta.env.VITE_API_URL}/fornecedor/${fornecedorParaEditar.id}`
        : `${import.meta.env.VITE_API_URL}/fornecedor`;

      const method = modoEdicao ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoFornecedor),
      });

      const fornecedorResult = await response.json();
      if (response.ok) {
        if (modoEdicao && onFornecedorAtualizado) {
          onFornecedorAtualizado(fornecedorResult);
          mostrarToast({
            mensagem: "Fornecedor atualizado com sucesso",
            tipo: "sucesso",
            posicao: "top-right",
          });
        } else {
          onFornecedorCriado(fornecedorResult);
          mostrarToast({
            mensagem: "Fornecedor criado com sucesso",
            tipo: "sucesso",
            posicao: "top-right",
          });
        }

        setNovoFornecedor({
          nome: "",
          cnpj: "",
          contato_principal: "",
          telefone: "",
          email: "",
          endereco: "",
        });
        setAberto(false);
      } else if (response.status === 409) {
        /**
         * Deu algum erro de conflito com o banco de dados
         * Exemplo: CNPJ já cadastrado
         */
        mostrarToast({
          mensagem: fornecedorResult.message,
          tipo: "erro",
          posicao: "top-right",
        });
      }
    } catch (error) {
      const acao = modoEdicao ? "atualizar" : "criar";
      console.error(`Erro ao ${acao} fornecedor:`, error);
      mostrarToast({
        mensagem: `Erro ao ${acao} fornecedor`,
        descricao: `Ocorreu um erro ao ${acao} o fornecedor`,
        tipo: "erro",
        posicao: "top-right",
      });
    }
  };

  const handleDialogClose = () => {
    setAberto(false);
    if (!modoEdicao) {
      setNovoFornecedor({
        nome: "",
        cnpj: "",
        contato_principal: "",
        telefone: "",
        email: "",
        endereco: "",
      });
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[550px] p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-semibold text-primary">
              {modoEdicao ? "Editar Fornecedor" : "Adicionar Fornecedor"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1">
              {modoEdicao
                ? "Atualize os dados do fornecedor e clique em salvar."
                : "Preencha os dados do novo fornecedor e clique em salvar."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 w-full">
            <div className="space-y-5 w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="nome" className="font-medium">
                  Nome
                </Label>
                <Input
                  id="nome"
                  name="nome"
                  value={novoFornecedor.nome}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-md border-input focus:ring-2 focus:ring-primary/30 transition-all"
                  required
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="cnpj" className="font-medium">
                  CNPJ
                </Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  value={novoFornecedor.cnpj}
                  onChange={handleInputChange}
                  placeholder="00.000.000/0000-00"
                  className="w-full h-10 rounded-md border-input focus:ring-2 focus:ring-primary/30 transition-all"
                  required
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="contato_principal" className="font-medium">
                  Nome do Contato Principal
                </Label>
                <Input
                  id="contato_principal"
                  name="contato_principal"
                  value={novoFornecedor.contato_principal}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-md border-input focus:ring-2 focus:ring-primary/30 transition-all"
                  required
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="telefone" className="font-medium">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={novoFornecedor.telefone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  className="w-full h-10 rounded-md border-input focus:ring-2 focus:ring-primary/30 transition-all"
                  required
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="email" className="font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={novoFornecedor.email}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-md border-input focus:ring-2 focus:ring-primary/30 transition-all"
                  required
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="endereco" className="font-medium">
                  Endereço
                </Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={novoFornecedor.endereco}
                  onChange={handleInputChange}
                  className="w-full h-10 rounded-md border-input focus:ring-2 focus:ring-primary/30 transition-all"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              className="px-5 py-2.5 font-medium border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 transition-all duration-200 shadow-sm cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="px-5 py-2.5 font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
