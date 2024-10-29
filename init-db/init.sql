CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,  -- ID único para cada certificado
    nome_aluno VARCHAR(100) NOT NULL,  -- Nome do Aluno
    nacionalidade VARCHAR(50),         -- Nacionalidade
    estado VARCHAR(50),                -- Estado
    data_nascimento DATE,              -- Data de Nascimento
    rg VARCHAR(20),                    -- RG
    data_conclusao DATE NOT NULL,      -- Data de Conclusão
    nome_curso VARCHAR(100) NOT NULL,  -- Nome do Curso
    carga_horaria INT NOT NULL,        -- Carga Horária
    numero_certificado UUID DEFAULT uuid_generate_v4() -- Número único do certificado (UUID)
);