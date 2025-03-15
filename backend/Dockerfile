FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Primeiro executa em modo dev para gerar o SQLite com as tabelas
RUN npm run start:dev & \
    sleep 10 && \
    kill $(jobs -p)

# Depois executa em modo produção
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
