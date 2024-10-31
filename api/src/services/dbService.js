// Importa a instância de pool de conexões do módulo de configuração do banco de dados.
const pool = require('../config/database');

// Define uma função assíncrona chamada 'insertCertificate' que recebe um objeto 'data' como parâmetro.
async function insertCertificate(data) {
  // Define a consulta SQL para inserir um novo certificado na tabela 'certificates'.
  // Os valores a serem inseridos são marcados como $1, $2, etc., que serão substituídos pelos valores correspondentes do array 'values'.
  const query = `INSERT INTO certificates (nome_aluno, nacionalidade, estado, data_nascimento, rg, data_conclusao, nome_curso, carga_horaria, numero_certificado, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pendente') RETURNING id`;
  
  // Cria um array 'values' que contém os dados do aluno, que serão passados para a consulta SQL.
  const values = [
    data.nome_aluno,          // Nome do aluno.
    data.nacionalidade,      // Nacionalidade do aluno.
    data.estado,             // Estado do aluno.
    data.data_nascimento,    // Data de nascimento do aluno.
    data.rg,                 // Registro Geral do aluno.
    data.data_conclusao,     // Data de conclusão do curso.
    data.nome_curso,         // Nome do curso.
    data.carga_horaria,      // Carga horária do curso.
    data.numero_certificado,  // Número do certificado (ID único).
  ];
  
  // Executa a consulta SQL usando o pool de conexões e aguarda a resposta.
  // Os valores no array 'values' são passados como parâmetros para evitar injeções de SQL.
  const res = await pool.query(query, values);
  
  // Retorna o ID do novo certificado inserido, acessando a primeira linha do resultado da consulta.
  return res.rows[0].id;
}

// Exporta a função 'inserirCertificate' para que possa ser utilizada em outros módulos da aplicação.
module.exports = { insertCertificate };