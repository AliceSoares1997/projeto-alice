import { Fornecedor } from "@/interfaces/fornecedor";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Mail, Phone, FileText, MapPin } from "lucide-react";

interface FornecedorDetalhesModalProps {
  aberto: boolean;
  setAberto: (aberto: boolean) => void;
  fornecedor: Fornecedor;
}

export function FornecedorDetalhesModal({
  aberto,
  setAberto,
  fornecedor,
}: FornecedorDetalhesModalProps) {
  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-lg [&>button]:hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold mb-1">
                {fornecedor.id} - {fornecedor.nome}
              </DialogTitle>
              <div className="flex items-center space-x-2 text-blue-100">
                <FileText className="h-4 w-4" />
                <span>{fornecedor.cnpj}</span>
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

          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 border border-white/30">
            {fornecedor.ativo ? (
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                Ativo
              </span>
            ) : (
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-400 mr-2"></span>
                Inativo
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">Contato Principal</span>
                <p className="font-medium">{fornecedor.contatoPrincipal}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">Telefone</span>
                <p className="font-medium">{fornecedor.telefone}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p className="font-medium">{fornecedor.email}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500">Endereço</span>
                <p className="font-medium">{fornecedor.endereco}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setAberto(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 cursor-pointer"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
