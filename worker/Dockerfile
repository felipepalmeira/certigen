FROM node:18
# Define a imagem base como Node.js na versão 14. Essa imagem inclui o ambiente necessário para rodar aplicações Node.js.

WORKDIR /usr/src/app
# Define o diretório de trabalho dentro do contêiner como /usr/src/app.
# Todo o código copiado e executado a partir deste ponto será relativo a esse diretório.

COPY package*.json ./
# Copia os arquivos package.json e package-lock.json (se houver) para o diretório de trabalho no contêiner.
# Esses arquivos são necessários para instalar as dependências.

RUN npm install
# Executa o comando npm install para instalar todas as dependências listadas no package.json.

COPY . .
# Copia todo o conteúdo do diretório atual para o diretório de trabalho no contêiner.

CMD ["node", "src/worker.js"]
# Define o comando a ser executado quando o contêiner iniciar.
# Nesse caso, executa o arquivo worker.js usando o Node.js.