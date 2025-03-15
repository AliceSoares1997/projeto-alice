import { toast } from "sonner";

type TipoToast = "sucesso" | "erro" | "aviso" | "info";

interface ToastPersonalizadoProps {
  mensagem: string;
  descricao?: string;
  tipo?: TipoToast;
  duracao?: number;
  posicao?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
}

const estilosBase = {
  borderRadius: "0.5rem",
  padding: "0.75rem 1rem",
  fontSize: "0.875rem",
  fontWeight: "500",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  textAlign: "center" as const,
  color: "#fff",
};

const estilosPorTipo = {
  sucesso: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    icon: "🚀",
  },
  erro: {
    background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
    icon: "🚨",
  },
  aviso: {
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    icon: "⚠️",
  },
  info: {
    background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    icon: "ℹ️",
  },
};

export const mostrarToast = ({
  mensagem,
  descricao,
  tipo = "info",
  duracao = 3000,
  posicao = "top-center",
}: ToastPersonalizadoProps) => {
  const estilo = {
    ...estilosBase,
    background: estilosPorTipo[tipo].background,
  };

  const opcoes = {
    icon: estilosPorTipo[tipo].icon,
    position: posicao,
    duration: duracao,
    style: estilo,
    description: descricao,
  };

  toast(mensagem, opcoes);
};
