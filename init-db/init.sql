CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,  
    nome_aluno VARCHAR(100) NOT NULL,  
    nacionalidade VARCHAR(50),         
    estado VARCHAR(50),                
    data_nascimento DATE,              
    rg VARCHAR(20),                    
    data_conclusao DATE NOT NULL,      
    nome_curso VARCHAR(100) NOT NULL,  
    carga_horaria INT NOT NULL,        
    numero_certificado UUID DEFAULT uuid_generate_v4(),
    status VARCHAR(20) DEFAULT 'pendente',  
    caminho_pdf VARCHAR(255)  
);
