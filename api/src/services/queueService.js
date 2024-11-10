
const amqp = require('amqplib');


async function sendToQueue(idCertificate) {
  
  const connection = await amqp.connect('amqp://rabbitmq');
  
  
  const channel = await connection.createChannel();
  
  
  const queue = 'queue_certificates';

  
  await channel.assertQueue(queue, { durable: true });
  
  
  channel.sendToQueue(queue, Buffer.from(JSON.stringify({ id: idCertificate })));

 
  setTimeout(() => {
    connection.close(); 
  }, 500);
}


module.exports = { sendToQueue };
