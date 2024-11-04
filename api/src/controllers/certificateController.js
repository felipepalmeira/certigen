// Importa o módulo dbService, que contém funções para interagir com o banco de dados.
const dbService = require('../services/dbService');

// Importa o módulo queueService, que contém funções para interagir com a fila RabbitMQ.
const queueService = require('../services/queueService');

// Define uma função assíncrona chamada 'createCertificate', que será usada como um handler para criar um certificado.
async function createCertificate(req, res) {
  // Obtém os dados do certificado a partir do corpo da requisição (req.body).
  const data = req.body;

  // Valida se os campos obrigatórios 'nome_aluno', 'nome_curso' e 'carga_horaria' estão presentes nos dados.
  if (!data.nome_aluno || !data.nome_curso || !data.carga_horaria) {
    // Se algum dos campos obrigatórios estiver ausente, retorna uma resposta com status 400 (Bad Request) e uma mensagem de erro.
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  // Tenta executar o bloco de código a seguir, e se algo der errado, o erro será tratado no bloco catch.
  try {
    // Chama a função 'insertCertificate' do dbService para inserir os dados do certificado no banco de dados.
    // Aguarda a operação ser concluída e obtém o ID do certificado recém-criado.
    const idCertificate = await dbService.insertCertificate(data);
    
    // Chama a função 'sendToQueue' do queueService para enviar o ID do certificado para a fila RabbitMQ, indicando que ele deve ser processado.
    await queueService.sendToQueue(idCertificate);
    
    // Retorna uma resposta com status 200 (OK) e uma mensagem informando que o certificado está em processamento, juntamente com o ID do certificado.
    res.status(200).json({ message: 'Certificado em processamento', id: idCertificate });
  } catch (error) {
    // Se ocorrer um erro durante o processo de inserção ou envio para a fila, imprime o erro no console.
    console.error(error);
   
    // Retorna uma resposta com status 500 (Internal Server Error) e uma mensagem de erro indicando que houve um problema ao processar o certificado.
    res.status(500).json({ error: `Erro ao processar o certificado ${error}` });
  }
}

// Exporta a função 'criarCertificado' para que possa ser utilizada em outros módulos da aplicação.
module.exports = { createCertificate };