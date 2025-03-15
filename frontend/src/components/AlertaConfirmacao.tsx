import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AlertaConfirmacaoProps = {
  aberto: boolean;
  setAberto: (aberto: boolean) => void;
  titulo: string;
  descricao: string;
  onConfirmar: () => void;
  textoBotaoConfirmar?: string;
  textoBotaoCancelar?: string;
  variante?: "padrao" | "perigo";
};

export function AlertaConfirmacao({
  aberto,
  setAberto,
  titulo,
  descricao,
  onConfirmar,
  textoBotaoConfirmar = "Confirmar",
  textoBotaoCancelar = "Cancelar",
  variante = "padrao",
}: AlertaConfirmacaoProps) {
  const handleConfirmar = () => {
    onConfirmar();
    setAberto(false);
  };

  return (
    <AlertDialog open={aberto} onOpenChange={setAberto}>
      <AlertDialogContent className="max-w-md rounded-xl border-0 shadow-lg">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle
            className={`text-xl font-bold ${
              variante === "perigo" ? "text-red-600" : "text-primary"
            }`}
          >
            {titulo}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            {descricao}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-3 pt-4">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="rounded-lg border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              {textoBotaoCancelar}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={variante === "perigo" ? "destructive" : "default"}
              className={`rounded-lg font-medium shadow-sm transition-all duration-200 ${
                variante === "perigo"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-primary hover:bg-primary/90"
              }`}
              onClick={handleConfirmar}
            >
              {textoBotaoConfirmar}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
