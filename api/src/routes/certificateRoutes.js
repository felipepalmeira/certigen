// Importa o módulo 'express', uma estrutura para construção de APIs e aplicações web em Node.js.
const express = require('express');

// Usa o método 'Router()' do Express para criar um novo roteador, que será usado para definir as rotas da API.
const router = express.Router();

// Importa o 'certificateController', que contém as funções de controle para as operações relacionadas a certificados.
const certificateController = require('../controllers/certificateController');

// Define uma rota POST para '/api/v1/certificate' e vincula essa rota ao método 'createCertificate' do certificateController.
// Quando uma requisição POST é feita para essa rota, o Express chama a função 'createCertificate' para processá-la.
router.post('/api/v1/certificate', certificateController.createCertificate);

// Exporta o roteador configurado para que ele possa ser utilizado em outras partes da aplicação, como na configuração principal de rotas.
module.exports = router;
