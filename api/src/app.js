// Importa o módulo Express, um framework que facilita a criação de APIs RESTful.
const express = require('express');

// Importa o middleware body-parser, que será usado para processar os corpos das requisições em JSON.
const bodyParser = require('body-parser');

// Importa as rotas definidas em './routes/certificateRoutes', onde estão os endpoints da API.
const certificateRoutes = require('./routes/certificateRoutes');

// Inicializa a aplicação Express.
const app = express();

// Configura o middleware body-parser para processar corpos de requisição JSON, tornando-os acessíveis no código como objetos JavaScript.
app.use(bodyParser.json());

// Adiciona as rotas de certificado à aplicação, tornando os endpoints definidos em `certificadoRoutes` disponíveis.
app.use(certificateRoutes);

// Define a porta em que a aplicação irá rodar. Neste caso, será a porta 3000.
const PORT = 3000;

// Inicia o servidor e faz com que ele ouça na porta especificada. Exibe uma mensagem no console confirmando que a API está em execução.
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
