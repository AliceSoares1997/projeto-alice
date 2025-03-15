import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
      <div className="w-16 h-1 bg-blue-600 my-6"></div>
      <h2 className="text-2xl font-medium text-gray-700 mb-4">Página não encontrada</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Button 
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Voltar ao início
      </Button>
    </div>
  );
} 