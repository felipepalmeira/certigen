const amqp = require('amqplib'); 
const { Pool } = require('pg'); 
const redis = require('redis');
const puppeteer = require('puppeteer'); 
const fs = require('fs-extra'); 
const path = require('path'); 


const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 5432,
});

const redisClient = redis.createClient({ url: 'redis://redis:6379' });
redisClient.connect(); 

const QUEUE_NAME = 'queue_certificates';

async function connectQueue() {
  try {
    
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('Aguardando mensagens na fila...');

    channel.consume(QUEUE_NAME, async (msg) => {
      try {
        const { id } = JSON.parse(msg.content.toString());
        await genCertificate(id);
        channel.ack(msg);
      } catch (error) {
        console.error(`Erro ao processar mensagem da fila: ${error.message}`);
        channel.nack(msg); 
      }
    });
  } catch (error) {
    console.error('Erro ao conectar na fila:', error.message);
   
    setTimeout(connectQueue, 5000);
  }
}


async function genCertificate(id) {
  try {
    const data = await loadDataDB(id);
    const html = await loadTemplateHTML(data);
    const pathPDF = await converterHTMLtoPDF(html, id);
    await updateDB(id, pathPDF);
    await cachePDF(id, pathPDF);
  } catch (error) {
    console.error(`Erro ao processar o certificado ${id}: `, error);
  }
}

async function loadDataDB(id) {
  const res = await pool.query('SELECT * FROM certificates WHERE id = $1', [id]);
  return res.rows[0];
}

async function loadTemplateHTML(data) {
  let template = await fs.readFile(path.join(__dirname, 'templates/certificate-template.html'), 'utf8');
  Object.keys(data).forEach((key) => {
    template = template.replace(`{{${key}}}`, data[key]);
  });
  return template;
}

async function converterHTMLtoPDF(html, id) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html);

  /*
  O metodo goto não trabalha com dados dinâmicos 

  const url = `file:///usr/src/app/src/templates/certificate-template.html?id=${id}`;
  await page.goto(url, { waitUntil: 'networkidle2' }); // Aguarda a página carregar completamente

  Aguardar carregamento de imagens ou qualquer outro recurso que precise estar visível no PDF
  await page.waitForSelector('img');
  
  */

  const pathPDF = path.join(__dirname, `pdfs/certificado_${id}.pdf`);
  await page.pdf({ path: pathPDF, format: 'A4', landscape: true, printBackground: true });
  await browser.close();

  return pathPDF;
}

async function updateDB(id, pathPDF) {
  await pool.query(
    'UPDATE certificates SET status = $1, caminho_pdf = $2 WHERE id = $3',
    ['generated', pathPDF, id]
  );
}

async function cachePDF(id, pathPDF) {
  const pdfBuffer = await fs.readFile(pathPDF);
  await redisClient.set(id.toString(), pdfBuffer.toString('base64'));
}

connectQueue().catch((err) => console.error('Erro ao conectar na fila:', err));


process.on('exit', () => redisClient.quit());
