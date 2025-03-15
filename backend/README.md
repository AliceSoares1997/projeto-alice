# Backend API

## Instalação

```bash
npm install
```

## Execução

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## Observações

- Utilizamos SQLite para ambiente de testes
- A configuração `synchronize: true` do TypeORM está ativada
- Em ambiente produtivo, recomenda-se:
  - Desativar `synchronize: true`
  - Migrar para PostgreSQL ou MySQL
  - Implementar migrations para controle de esquema
