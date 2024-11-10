# Projeto de Emissão de Certificados

## Descrição
Este projeto é uma aplicação de microserviços que automatiza a geração de certificados de conclusão para uma instituição de ensino. A API recebe os dados do aluno, processa a solicitação, enfileira o pedido para um worker, que então gera um PDF do certificado. Esse PDF é salvo e armazenado em cache (usando Redis) para respostas rápidas.

## Layout do Certificado
![Certificado Layout](https://github.com/felipepalmeira/certigen/blob/main/worker/src/templates/img/template.png)


O layout do certificado está desenhado no [Figma](https://www.figma.com/design/7350eIKtOEU8USfYcXc4f6/Certificado?node-id=0-1&t=cLcVlTWvQMm12Llf-1). Certifique-se de seguir o design no Figma para manter a consistência ao realizar qualquer atualização no template.


## Arquitetura
O projeto é dividido em múltiplos serviços, cada um com uma função específica:
- **API**: Responsável por receber as solicitações de certificados via endpoints HTTP.
- **Worker**: Processa as solicitações da fila para gerar o PDF do certificado.
- **Banco de Dados**: Usando PostgreSQL para armazenar os dados dos alunos e status dos certificados.
- **RabbitMQ**: Fila de mensagens que organiza os pedidos de geração de certificados.
- **Redis**: Cache para armazenar temporariamente os PDFs gerados, acelerando a resposta para solicitações repetidas.

## Estrutura de Diretórios
```
├── api
│   ├── routes
│   ├── controllers
│   ├── services
│   └── config
├── worker
│   ├── templates
│   └── pdfs
├── docker-compose.yml
└── README.md
```

## Pré-requisitos
- [Docker](https://www.docker.com/) instalado
- [Node.js](https://nodejs.org/) e npm instalados (para desenvolvimento local)

## Configuração do Ambiente

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd projeto-de-certificados
   ```

2. Crie o arquivo `.env` na pasta `/api` e `/worker` com as variáveis de ambiente necessárias:
   ```plaintext
   DATABASE_HOST=db
   DATABASE_USER=user
   DATABASE_PASSWORD=pass
   DATABASE_NAME=certificates
   RABBITMQ_HOST=rabbitmq
   REDIS_HOST=redis
   ```

## Inicialização do Projeto

1. Suba os contêineres usando Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. Acesse a API na porta `3000`. 

## Endpoints da API

- **POST /api/v1/certificado**: Recebe os dados do aluno e do curso e enfileira o pedido de certificado.
  - **Corpo da requisição (JSON)**:
    ```json
    {
      "nome_aluno": "Felipe Palmeira",
      "nacionalidade": "Brasileiro",
      "estado": "SP",
      "data_nascimento": "2000-01-01",
      "rg": "123456789",
      "data_conclusao": "2025-11-30",
      "nome_curso": "Sistemas de Informação",
      "carga_horaria": 2400
    }
    ```

  - **Resposta**:
    - **200 OK**: Certificado em processamento.
    - **400 Bad Request**: Dados inválidos.
    - **500 Internal Server Error**: Erro ao processar o certificado.

## Serviços

### API
- **Função**: Recebe solicitações de criação de certificado, insere dados no banco de dados e envia uma mensagem para a fila RabbitMQ.
- **Localização**: Diretório `/api`

### Worker
- **Função**: Consome mensagens da fila RabbitMQ, gera o certificado em PDF, salva o arquivo e atualiza o status no banco de dados.
- **Localização**: Diretório `/worker`
- **PDF Template**: O template HTML para o certificado está em `/worker/src/templates/diplomaTemplate.html`.

### Banco de Dados
- **Função**: Armazena os dados dos alunos e o status de cada certificado.
- **Localização**: Configurado no `docker-compose.yml` com PostgreSQL como imagem de banco de dados.

### RabbitMQ
- **Função**: Organiza e distribui as solicitações de certificados para o worker.
- **Localização**: Configurado no `docker-compose.yml`.

### Redis
- **Função**: Cache de PDFs gerados para respostas rápidas a solicitações futuras.
- **Localização**: Configurado no `docker-compose.yml`.

## Exemplo de Uso

1. Faça uma solicitação `POST` para o endpoint `/api/v1/certificado` com os dados do aluno.
2. A API responderá que o certificado está em processamento.
3. O worker processará a solicitação e gerará o PDF.
4. O PDF será armazenado no diretório configurado e em cache no Redis para acesso rápido.

## Tecnologias Utilizadas

- **Node.js**: Runtime para a API e worker.
- **Express**: Framework de API para o serviço HTTP.
- **PostgreSQL**: Banco de dados para armazenar dados dos alunos e certificados.
- **RabbitMQ**: Serviço de mensagens para comunicação assíncrona entre a API e o worker.
- **Redis**: Cache de PDFs gerados.
- **Docker**: Conteinerização dos serviços.
- **Puppeteer**: Para converter HTML em PDF.

## Desenvolvimento Local

1. Instale as dependências na pasta `/api` e `/worker`:
   ```bash
   npm install
   ```

2. Inicie a API e o worker localmente para testes e desenvolvimento.

## Contribuições

1. Faça um fork do projeto
2. Crie uma branch de recurso (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adicionar nova funcionalidade'`)
4. Dê um push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.
