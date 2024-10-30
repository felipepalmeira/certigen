const amqp = require('amqplib'); // Importa a biblioteca amqplib para interagir com RabbitMQ.
const { Pool } = require('pg'); // Importa o Pool da biblioteca pg para gerenciar conexões com o banco de dados PostgreSQL.
const redis = require('redis'); // Importa a biblioteca redis para interagir com o servidor Redis.
const puppeteer = require('puppeteer'); // Importa a biblioteca Puppeteer para gerar PDFs a partir de HTML.
const fs = require('fs-extra'); // Importa a biblioteca fs-extra, que fornece métodos adicionais para manipulação de arquivos.
const path = require('path'); // Importa a biblioteca path para manipular caminhos de arquivos.

 // Configurações do banco, RabbitMQ e Redis
const pool = new Pool({ // Cria uma nova instância do Pool para gerenciar conexões com o PostgreSQL.
  host: process.env.DATABASE_HOST, // Define o host do banco de dados a partir da variável de ambiente DATABASE_HOST.
  user: process.env.DATABASE_USER, // Define o usuário do banco de dados a partir da variável de ambiente DATABASE_USER.
  password: process.env.DATABASE_PASSWORD, // Define a senha do banco de dados a partir da variável de ambiente DATABASE_PASSWORD.
  database: process.env.DATABASE_NAME, // Define o nome do banco de dados a partir da variável de ambiente DATABASE_NAME.
  port: 5432, // Define a porta padrão do PostgreSQL.
});
const redisClient = redis.createClient({ host: 'redis', port: 6379 }); // Cria um cliente Redis, especificando o host e a porta do Redis.
const QUEUE_NAME = 'queue_certificates'; // Define o nome da fila onde as mensagens serão enfileiradas.

async function connectQueue() { // Função assíncrona para conectar à fila RabbitMQ.
  const connection = await amqp.connect('amqp://rabbitmq'); // Estabelece uma conexão com o RabbitMQ.
  const channel = await connection.createChannel(); // Cria um canal de comunicação no RabbitMQ.
  await channel.assertQueue(QUEUE_NAME, { durable: true }); // Garante que a fila existe e é durável.

  console.log('Aguardando mensagens na fila...'); // Exibe uma mensagem no console indicando que o worker está esperando por mensagens.

  channel.consume(QUEUE_NAME, async (msg) => { // Consome mensagens da fila especificada.
    const { id } = JSON.parse(msg.content.toString()); // Extrai o ID do certificado da mensagem recebida.
    await gerarCertificado(id); // Chama a função para gerar o certificado usando o ID extraído.
    channel.ack(msg); // Confirma que a mensagem foi processada com sucesso.
  });
}

async function genCertificate(id) { // Função assíncrona que gera um certificado para o ID fornecido.
  try {
    const data = await loadDataDB(id); // Carrega os dados do certificado a partir do banco de dados usando o ID.
    const html = await loadTemplateHTML(data); // Carrega o template HTML e substitui os placeholders pelos dados do certificado.

    const pathPDF = await converterHTMLtoPDF(html, id); // Converte o HTML para PDF e obtém o caminho do arquivo gerado.
    await updateDB(id, pathPDF); // Atualiza o registro no banco de dados com o status do certificado e o caminho do PDF.
    await cachePDF(id, pathPDF); // Armazena o PDF no Redis para acesso rápido futuro.
  } catch (error) {
    console.error(`Erro ao processar certificado ${id}: `, error); // Exibe uma mensagem de erro no console caso ocorra um erro.
  }
}

async function loadDataDB(id) { // Função assíncrona que carrega os dados do certificado a partir do banco de dados.
  const res = await pool.query('SELECT * FROM certificados WHERE id = $1', [id]); // Realiza uma consulta SQL para obter os dados do certificado pelo ID.
  return res.rows[0]; // Retorna os dados do primeiro registro encontrado.
}

async function loadTemplateHTML(data) { // Função assíncrona que carrega o template HTML e substitui placeholders pelos dados.
  let template = await fs.readFile(path.join(__dirname, 'templates/diplomaTemplate.html'), 'utf8'); // Lê o template HTML do arquivo.
  Object.keys(data).forEach((key) => { // Itera sobre as chaves dos dados do certificado.
    template = template.replace(`{{${key}}}`, data[key]); // Substitui cada placeholder no template pelo valor correspondente.
  });
  return template; // Retorna o template HTML modificado.
}

async function converterHTMLtoPDF(html, id) { // Função assíncrona que converte HTML para PDF.
  const browser = await puppeteer.launch(); // Inicia uma nova instância do navegador usando Puppeteer.
  const page = await browser.newPage(); // Cria uma nova página no navegador.
  await page.setContent(html); // Define o conteúdo da página como o HTML fornecido.

  const pathPDF = path.join(__dirname, `pdfs/certificado_${id}.pdf`); // Define o caminho onde o PDF será salvo.
  await page.pdf({ path: pathPDF, format: 'A4' }); // Gera o PDF a partir do conteúdo HTML e salva no caminho especificado.
  await browser.close(); // Fecha a instância do navegador.

  return pathPDF; // Retorna o caminho do PDF gerado.
}

async function updateDB(id, pathPDF) { // Função assíncrona que atualiza o registro do certificado no banco de dados.
  await pool.query( // Realiza uma consulta SQL para atualizar o registro do certificado.
    'UPDATE certificados SET status = $1, caminho_pdf = $2 WHERE id = $3',
    ['gerado', pathPDF, id] // Define os valores a serem atualizados (status e caminho do PDF) para o certificado correspondente ao ID.
  );
}

async function cachePDF(id, pathPDF) { // Função assíncrona que armazena o PDF no Redis para cache.
  const pdfBuffer = await fs.readFile(pathPDF); // Lê o conteúdo do PDF gerado.
  redisClient.setex(id, 3600, pdfBuffer.toString('base64')); // Armazena o PDF no Redis como uma string Base64, com uma expiração de 3600 segundos (1 hora).
}

connectQueue().catch((err) => console.error('Erro ao conectar na fila:', err)); // Chama a função para conectar à fila e trata qualquer erro que possa ocorrer.
