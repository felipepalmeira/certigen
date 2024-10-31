# Usando uma imagem do Node.js
FROM node:18

# Define o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copia os arquivos do package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código da API
COPY . .

# Expõe a porta da API
EXPOSE 3000

# Inicia a API
CMD ["node", "src/app.js"]
