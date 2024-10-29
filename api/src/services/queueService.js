// Importa a biblioteca 'amqplib', que é usada para se conectar e interagir com o RabbitMQ.
const amqp = require('amqplib');

// Define uma função assíncrona chamada 'sendToQueue' que recebe um parâmetro 'idCertificate'.
async function sendToQueue(idCertificate) {
  // Estabelece uma conexão com o RabbitMQ usando a URL do serviço. 'rabbitmq' é o nome do serviço configurado no Docker.
  const connection = await amqp.connect('amqp://rabbitmq');
  
  // Cria um canal de comunicação para enviar e receber mensagens.
  const channel = await connection.createChannel();
  
  // Define o nome da fila onde as mensagens serão enviadas.
  const queue = 'queue_certificates';

  // Assegura que a fila existe; se não existir, ela será criada. A opção { durable: true } garante que a fila persista mesmo se o RabbitMQ for reiniciado.
  await channel.assertQueue(queue, { durable: true });
  
  // Envia uma mensagem para a fila, contendo o ID do certificado. A mensagem é convertida para um buffer de bytes a partir de uma string JSON.
  channel.sendToQueue(queue, Buffer.from(JSON.stringify({ id: idCertificate })));

  // Define um timeout de 500 milissegundos para fechar a conexão com o RabbitMQ após o envio da mensagem.
  setTimeout(() => {
    connection.close(); // Fecha a conexão com o RabbitMQ.
  }, 500);
}

// Exporta a função 'sendToQueue' para que possa ser utilizada em outros módulos da aplicação.
module.exports = { sendToQueue };
