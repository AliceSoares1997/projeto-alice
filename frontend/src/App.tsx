import { Routes, Route } from "react-router-dom";
import ListarProdutos from "./pages/ListarProdutos";
// import EditarProduto from './pages/EditarProduto'
import ListarFornecedores from "./pages/ListarFornecedores";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ListarProdutos />} />
          <Route path="/produtos" element={<ListarProdutos />} />
          {/* <Route path="/produtos/:id" element={<EditarProduto />} /> */}
          <Route path="/fornecedores" element={<ListarFornecedores />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
