Este projeto é uma aplicação full-stack com Node.js, PostgreSQL e Angular. Ele inclui uma API REST para gerenciamento de usuários e uma interface web para login e visualização de dados de cervejarias.

## Estrutura do Projeto

O projeto está dividido em duas partes:

- **Front-end**: Localizado na pasta `front`, é uma aplicação Angular que fornece uma interface de usuário para login e listagem de cervejarias.
- **Back-end**: Localizado na pasta `back`, é uma aplicação Node.js que expõe a API REST e gerencia a autenticação e CRUD de usuários.

## Configuração do Ambiente

### Requisitos

- Node.js (versão LTS recomendada)
- PostgreSQL
- Angular CLI

### Configuração do Front-end

1. Navegue até a pasta `front`:

   ```bash
   cd path/to/myTapp/front
2. npm install
3. ng serve
  A aplicação estará disponível em http://localhost:4200.

### Configuração do Back

1. Navegue até a pasta `back`:

   ```bash
   cd path/to/myTapp/front
2. npm install
3. Configure as variáveis de ambiente:
  Crie um arquivo .env na pasta back com o seguinte conteúdo:
  DB_USER='avnadmin'
  DB_PASSWORD='AVNS_jh0j1PBf9D13EeSRewR'
  DB_HOST='pg-1c5ffb14-pedropaladinisoares16-8adc.h.aivencloud.com'
  DB_PORT=23637
  DB_NAME='defaultdb'
  JWT_SECRET='5c0f97e39db04def474053dbd266d8ae018fd47e2867360edf3fe250dc389c28'
4. Inicie o seervidor com npm start
   A API estará disponível em http://localhost:3000.

## Endpoints da api
### Autenticação
Para obter um token de autenticação, use o seguinte comando:
   curl --location 'localhost:3000/auth' \
   --header 'Content-Type: application/json' \
   --data '{"username":"mytapp","password":"teste"}'


### Registro de usuário
curl --location 'localhost:3000/register' \
--header 'Authorization: TOKEN' \
--header 'Content-Type: application/json' \
--data '{
    "username": "mytapp",
    "password": "teste",
    "passwordConfirm": "teste"
}'

### UPDATE de usuário
curl --location 'localhost:3000/register' \
--header 'Authorization: TOKEN' \
--header 'Content-Type: application/json' \
--data '{
    "username": "mytapp",
    "password": "teste",
    "passwordConfirm": "teste"
}'

### Exclusão de usuário
curl --location --request DELETE 'localhost:3000/delete' \
--header 'Authorization: Bearer YOUR_TOKEN_HERE' \
--data ''



### AS VARIÁVEIS ACIMA FORAM CRIADAS PARA ESTE ÚNICO PROJETO
