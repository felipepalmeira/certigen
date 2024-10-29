// CONFIGURAÇÃO DO BANCO DE DADOS 


// Importa o módulo 'pg' e extrai o objeto 'Pool', que permite gerenciar um conjunto de conexões com o banco de dados PostgreSQL.
const { Pool } = require('pg');

// Cria uma nova instância do Pool, que gerencia múltiplas conexões com o banco de dados PostgreSQL.
// O Pool usa variáveis de ambiente para configurar os detalhes da conexão, tornando o código mais seguro e flexível.
const pool = new Pool({
  host: process.env.DATABASE_HOST,       // Define o host do banco de dados a partir da variável de ambiente DATABASE_HOST.
  user: process.env.DATABASE_USER,       // Define o usuário do banco de dados a partir da variável de ambiente DATABASE_USER.
  password: process.env.DATABASE_PASSWORD, // Define a senha do banco de dados a partir da variável de ambiente DATABASE_PASSWORD.
  database: process.env.DATABASE_NAME,   // Define o nome do banco de dados a partir da variável de ambiente DATABASE_NAME.
  port: 5432,                            // Define a porta do banco de dados (5432 é a porta padrão do PostgreSQL).
});

// Exporta a instância de pool para que possa ser usada em outras partes da aplicação para executar consultas no banco de dados.
module.exports = pool;