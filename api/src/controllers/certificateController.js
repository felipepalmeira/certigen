
const dbService = require('../services/dbService');


const queueService = require('../services/queueService');


async function createCertificate(req, res) {

  const data = req.body;

  
  if (!data.nome_aluno || !data.nome_curso || !data.carga_horaria) {
   
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  
  try {
    
    const idCertificate = await dbService.insertCertificate(data);
    
    
    await queueService.sendToQueue(idCertificate);
    
    
    res.status(200).json({ message: 'Certificado em processamento', id: idCertificate });
  } catch (error) {
    
    console.error(error);
   
   
    res.status(500).json({ error: `Erro ao processar o certificado ${error}` });
  }
}


module.exports = { createCertificate };