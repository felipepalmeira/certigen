
FROM node:18


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


RUN useradd -m myuser


USER myuser


WORKDIR /usr/src/app


COPY --chown=myuser:myuser package*.json ./

# Instale as dependências
RUN npm install


COPY --chown=myuser:myuser . .


CMD ["node", "src/worker.js"]
