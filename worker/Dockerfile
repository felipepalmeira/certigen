# Use uma imagem base do Node.js
FROM node:18

# Instala as bibliotecas necessárias
RUN apt-get update && apt-get install -y \
    libnss3 \
    libgconf-2-4 \
    libxss1 \
    libxi6 \
    libgdk-pixbuf2.0-0 \
    libasound2 \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxrandr2 \
    libxshmfence1 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1 \
    wget

# Crie um usuário não-root
RUN useradd -m myuser

# Mude para o usuário não-root
USER myuser

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos de package.json e package-lock.json
# com propriedade para myuser
COPY --chown=myuser:myuser package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos
COPY --chown=myuser:myuser . .


CMD ["node", "src/worker.js"]
# Define o comando a ser executado quando o contêiner iniciar.
# Nesse caso, executa o arquivo worker.js usando o Node.js.