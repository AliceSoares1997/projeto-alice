FACULDADE GRAN (https://faculdade.grancursosonline.com.br/)
 Projeto Disciplina Projeto Integrador

# Frontend

## Instalação

```bash
npm install --frozen-lockfile
```

## Execução

### Desenvolvimento
```bash
npm run dev
```

## Configuração

Certifique-se de configurar o arquivo `.env` na raiz do projeto:

```
VITE_API_URL=http://localhost:3000
```

Para ambiente de produção, atualize a URL da API conforme necessário:

```
VITE_API_URL=https://alice-backend.6cr7ox.easypanel.host
```

## Observações

- A aplicação utiliza Vite como bundler
- As variáveis de ambiente devem começar com `VITE_` para serem acessíveis
- O serviço de API está centralizado em `src/services/api.ts`
