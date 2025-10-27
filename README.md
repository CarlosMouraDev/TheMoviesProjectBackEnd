# API de filmes favoritos

Este projeto é o **back-end** da aplicação de filmes favoritos, desenvolvido com **NestJS**, **Prisma ORM** e **JWT (JSON Web Token)** para autenticação.  
Ele permite **cadastro e login de usuários**, **gerenciamento de filmes favoritos**, e a **criação de links públicos** para compartilhar listas de favoritos.

---

## Hospedagem do Back-End

O **back-end** deste projeto está hospedado na plataforma **Render**, e pode ser acessado através do seguinte endpoint base:

**API Base URL:** [https://themoviesprojectbackend.onrender.com](https://themoviesprojectbackend.onrender.com)

A escolha do Render se deu por oferecer uma configuração simples e gratuita para deploys de aplicações **Node.js** com **PostgreSQL**.

> ⚠️ **Atenção:** Como o projeto está hospedado em um **plano gratuito**, o servidor entra em **modo de hibernação** após um período de inatividade (geralmente cerca de 15 minutos sem requisições).  
> Quando isso acontece, a **primeira requisição** após esse tempo pode demorar **30 segundos a 1 minuto** para responder.  
> Depois disso, o servidor “acorda” e as requisições voltam a ter desempenho normal.

## Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)** — Framework Node.js para aplicações escaláveis.
- **[Prisma ORM](https://www.prisma.io/)** — ORM moderno e intuitivo.
- **[JWT](https://jwt.io/)** — Autenticação baseada em tokens.
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** — Criptografia de senhas.
- **[PostgreSQL](https://www.postgresql.org/)** — Banco de dados relacional.
- **[Axios](https://axios-http.com/)** — Integração com o front-end e conexão com a api de filmes.
- **[TMDb API](https://developer.themoviedb.org/)** — Fonte de informações sobre filmes.

---

## Configuração do Projeto

### Clonar o repositório

```bash
git clone https://github.com/CarlosMouraDev/TheMoviesProjectBackEnd
cd TheMoviesProjectBackEnd
```

### Instalar dependências

```bash
npm install
```

### Configurar variáveis de ambiente

Edite o `.env.EXAMPLE` com suas informações de acordo com o indicado nos comentários e renomeie para `.env`.

### Rodar o Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

### Iniciar o servidor

```bash
npm run start:dev
```

A API estará disponível em:  
**http://localhost:3000**

---

## Autenticação

A autenticação é baseada em **JWT (Bearer Token)**.  
Após o login, o usuário recebe um **token de acesso** que deve ser enviado no cabeçalho das requisições protegidas:

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## Endpoints da API

### Movies (`/movies`)

### Filmes populares

**GET** `/movies/popular?page={page}`

**Resposta (200)**:

```json
{
  "page": 1,
  "total_pages": 53262,
  "total_results": 1065225,
  "results": [
    {
      (dados dos filmes)
    }
  ]
}
```

### Pesquisar filmes

**GET** `/movies/search?query={filme}&page={page}`

**Resposta (200)**:

```json
{
  "page": 1,
  "total_pages": 53262,
  "total_results": 1065225,
  "results": [
    {
      (dados dos filmes)
    }
  ]
}
```

### Usuários (`/users`)

#### Criar conta

**POST** `/users/register`

```json
{
  "name": "Carlos",
  "email": "carlos@email.com",
  "password": "12345"
}
```

**Resposta (201)**:

```json
{
  "message": "Usuário criado"
}
```

---

### Autenticação (`/auth`)

#### Login

**POST** `/auth/login`

```json
{
  "email": "carlos@email.com",
  "password": "12345"
}
```

**Resposta (200)**:

```json
{
  "accessToken": "token...",
  "name": "Carlos"
}
```

---

### Favoritos (`/favorites`)

#### Listar favoritos (autenticado)

**GET** `/favorites`

**Headers:**

```
Authorization: Bearer <token>
```

**Resposta:**

```json
[
  {
    (dados dos filmes favoritados)
  }
]
```

---

#### Adicionar filme aos favoritos

**POST** `/favorites`

**Headers:**

```
Authorization: Bearer <token>
```

```json
{
  "movieId": 603
}
```

**Resposta (201)**:

```json
{
  "id": 1,
  "movieId": 603,
  "userId": 1,
  "createdAt": "2025-10-26T01:56:10.661Z"
}
```

---

#### Remover filme dos favoritos

**DELETE** `/favorites/{movieId}`

**Headers:**

```
Authorization: Bearer <token>
```

**Resposta (200)**:

```json
{
  "message": "Filme excluído dos favoritos",
  "status": 200
}
```

---

### Links Públicos

#### Obter link público do usuário autenticado

**GET** `/users/public-link`

**Headers:**

```
Authorization: Bearer <token>
```

**Resposta (200):**

```json
{
  "publicId": "8c8c8c8c-aaaa-bbbb-cccc-dddddddddddd",
  "link": "favorites/public/8c8c8c8c-aaaa-bbbb-cccc-dddddddddddd"
}
```

---

#### Ver favoritos públicos de outro usuário

**GET** `/favorites/public/{publicId}`

**Exemplo de resposta:**

```json
{
  "name": "Carlos",
  "movies": [
    {
      (dados dos filmes favoritados)
    }
  ]
}
```

---

## Prisma Schema

```prisma
model User {
  id        Int         @id @default(autoincrement())
  name      String
  email     String      @unique
  password  String
  favorites Favorite[]
  publicId  String?     @unique @default(uuid())
  createdAt DateTime    @default(now())
}

model Favorite {
  id        Int      @id @default(autoincrement())
  movieId   Int
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
```

---

## Fluxo de Autenticação

1. Usuário se registra com nome, e-mail e senha.
2. No login, o back-end valida as credenciais.
3. Se corretas, gera um **token JWT** com expiração.
4. O token é armazenado no `localStorage` pelo front-end.
5. Todas as rotas autenticadas usam `Authorization: Bearer token`.

---

## Scripts Úteis

| Comando                  | Descrição                    |
| ------------------------ | ---------------------------- |
| `npm run start`          | Inicia o servidor            |
| `npm run start:dev`      | Modo de desenvolvimento      |
| `npx prisma studio`      | Abre painel visual do Prisma |
| `npx prisma migrate dev` | Executa migrações do banco   |
| `npm run build`          | Gera build de produção       |

---

## Segurança

- Senhas são **hashadas com bcrypt** antes de salvar.
- Tokens JWT são **validados em cada requisição**.
- As rotas públicas e privadas são protegidas por **Guards do NestJS**.

---

## Desenvolvido por

**Carlos Eduardo Moura Lemes** ©  
[LinkedIn](https://www.linkedin.com/in/carlosmouradev)
