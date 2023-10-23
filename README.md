# Labercommerce BackEnd

Projeto de prática em back-end com a criação de uma API vinculada com uma base de dados real. As tecnologias utilizadas na contrução da API foram TypeScript, NodeJS, cors, knex e express. A base de dados foi construída utilizando Sqlite3.


### Configuração do Ambiente

1. Clone o repositório:


git clone https://github.com/seurepositorio/seuprojeto.git
cd labbercommerce-backend

2. Instale as dependências:

npm install

3. Configure o banco de dados:
### Crie o banco de dados

npx knex migrate:latest

### Se desejar, popule o banco de dados com dados iniciais (seeds)

npx knex seed:run


### Uso da API

Para iniciar o servidor, execute o seguinte comando:


npm run dev

A API estará disponível em http://localhost:3003.

Certifique-se de que o servidor esteja em execução antes de fazer solicitações à API.


# Endpoints da API

A API permite que você realize uma série de ações, como buscar informações de usuários, criar novos usuários, acessar dados de produtos, editar produtos existentes, criar novos produtos, além de gerenciar compras, como visualizar todas as compras, criar novas compras e excluir compras específicas com base em seus identificadores exclusivos (ID).

### Usuários
* GET /api/usuarios: Obtenha a lista de todos os usuários.
* POST /api/usuarios: Crie um novo usuário.
* PUT /api/usuarios/:id: Atualize os dados de um usuário existente.


### Produtos
* GET /api/produtos: Obtenha a lista de todos os produtos.
* POST /api/produtos: Crie um novo produto.
* PUT /api/produtos/:id: Atualize os dados de um produto existente.


### Compras
* GET /api/compras: Obtenha a lista de todas as compras.
* POST /api/compras: Crie uma nova compra.
* PUT /api/compras/:id: Atualize os dados de uma compra existente.
* DELETE /api/compras/:id: Exclua uma compra.


## Documentação no Postman

[https://documenter.getpostman.com/view/28314586/2s9YRCXBtT]

## Dependências

O projeto utiliza as seguintes dependências:

### Dependências de Desenvolvimento

- **@types/cors**: ^2.8.14
- **@types/express**: ^4.17.17
- **@types/knex**: ^0.16.1
- **@types/node**: ^20.5.7
- **cors**: ^2.8.5
- **express**: ^4.18.2
- **ts-node-dev**: ^2.0.0
- **typescript**: ^5.2.2

### Dependências de Produção

- **knex**: ^3.0.1
- **sqlite3**: ^5.1.6