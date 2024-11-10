
const pool = require('../config/database');


async function insertCertificate(data) {
  
  const query = `INSERT INTO certificates (nome_aluno, nacionalidade, estado, data_nascimento, rg, data_conclusao, nome_curso, carga_horaria, numero_certificado, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pendente') RETURNING id`;
  
 
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
  
  
  const res = await pool.query(query, values);
  
  
  return res.rows[0].id;
}


module.exports = { insertCertificate };