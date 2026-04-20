<div align="center">

<br/>

```
░█████╗░██████╗░██████╗░  ███████╗░█████╗░██╗░░██╗░█████╗░██╗░░░░░░█████╗░██████╗░
██╔══██╗██╔══██╗██╔══██╗  ██╔════╝██╔══██╗██║░░██║██╔══██╗██║░░░░░██╔══██╗██╔══██╗
███████║██████╔╝██████╔╝  ███████╗██║░░╚═╝███████║██║░░██║██║░░░░░███████║██████╔╝
██╔══██║██╔═══╝░██╔═══╝░  ╚════██║██║░░██╗██╔══██║██║░░██║██║░░░░░██╔══██║██╔══██╗
██║░░██║██║░░░░░██║░░░░░  ███████║╚█████╔╝██║░░██║╚█████╔╝███████╗██║░░██║██║░░██║
╚═╝░░╚═╝╚═╝░░░░░╚═╝░░░░░  ╚══════╝░╚════╝░╚═╝░░╚═╝░╚════╝░╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝
```

### Sistema de Gestão Acadêmica — Full Stack Mobile

<br/>

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

<br/>

> Projeto desenvolvido para a disciplina de **Programação para Dispositivos Móveis I**  
> **Anderson Fontes Fernandes Júnior** · Fatec Jacareí · DSM · 4º Semestre

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Configuração do Backend](#-configuração-do-backend)
- [Configuração do Frontend](#-configuração-do-frontend)
- [Guia de Testes para o Professor](#-guia-de-testes-para-o-professor)
- [Credenciais de Acesso](#-credenciais-de-acesso)
- [Estrutura do Projeto](#-estrutura-do-projeto)

---

## 📖 Sobre o Projeto

O **App Scholar** é uma aplicação mobile full-stack desenvolvida para a gestão educacional da Fatec Jacareí. O sistema permite a interação entre os diferentes perfis institucionais — alunos, professores e direção — com controle de acesso baseado em papéis (**RBAC**), autenticação segura via JWT e visualização de dados acadêmicos em tempo real.

A aplicação abrange desde o lançamento de chamadas e notas pelo professor, até a consulta de boletim e frequência pelo aluno, passando pela administração de usuários e disciplinas pela direção.

---

## ✨ Funcionalidades

| Módulo | Funcionalidade |
|---|---|
| 🔐 **Autenticação** | Login seguro com JWT e persistência de sessão via AsyncStorage |
| 👤 **RBAC** | Telas e permissões dinâmicas por perfil (Master / Direção / Professor / Aluno) |
| 📋 **Chamada Digital** | Professor registra presença por aula diretamente no app |
| 📝 **Lançamento de Notas** | Notas lançadas por atividade com pesos percentuais configurados |
| 📊 **Boletim Inteligente** | Média calculada automaticamente com alerta de reprovação por faltas |
| 🏫 **Gestão Administrativa** | Cadastro e controle de alunos, professores e disciplinas |
| 🔒 **Senhas Criptografadas** | Bcrypt com sal gerado via `pgcrypto` no banco de dados |

---

## 🏗️ Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│                    DISPOSITIVO MÓVEL                     │
│   React Native (Expo)                                    │
│   ├── Autenticação JWT (AsyncStorage)                    │
│   ├── Telas por perfil (RBAC)                            │
│   └── Axios → chamadas à API REST                        │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTP / JSON
┌───────────────────────▼──────────────────────────────────┐
│                    SERVIDOR (Backend)                    │
│   Node.js + Express                                      │
│   ├── Rotas protegidas com middleware JWT                │
│   ├── Validação de perfil (RBAC)                         │
│   └── Conexão com PostgreSQL via pg                      │
└───────────────────────┬──────────────────────────────────┘
                        │ SQL
┌───────────────────────▼──────────────────────────────────┐
│                  BANCO DE DADOS                          │
│   PostgreSQL                                             │
│   ├── usuarios, professores, alunos                      │
│   ├── disciplinas, atividades, notas_atividades          │
│   └── chamadas, solicitacoes                             │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias

**Mobile (Frontend)**
- [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/)
- [Axios](https://axios-http.com/) — integração com a API
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — persistência local do token

**Servidor (Backend)**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) — autenticação JWT
- [bcrypt](https://www.npmjs.com/package/bcrypt) — criptografia de senhas
- [pg](https://node-postgres.com/) — driver PostgreSQL

**Banco de Dados**
- [PostgreSQL](https://www.postgresql.org/) com extensão `pgcrypto`

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) `v18+`
- [PostgreSQL](https://www.postgresql.org/) `v14+`
- [Expo Go](https://expo.dev/client) no celular (iOS ou Android)
- [Git](https://git-scm.com/)

---

## 🗄️ Configuração do Banco de Dados

**1.** Conecte-se ao PostgreSQL e crie o banco:

```sql
CREATE DATABASE app_scholar;
```

**2.** Selecione o banco e habilite a extensão necessária:

```sql
\c app_scholar
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

**3.** Execute o script SQL completo localizado na raiz do projeto:

```bash
psql -U seu_usuario -d app_scholar -f banco_app_scholar.sql
```

> ✅ O script cria todas as tabelas e já popula o banco com dados de teste, incluindo usuários, disciplinas, notas e chamadas.

---

## ⚙️ Configuração do Backend

**1.** Acesse a pasta do backend:

```bash
cd AppScholar/backend
```

**2.** Instale as dependências:

```bash
npm install
```

**3.** Crie o arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_scholar
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres

# JWT
JWT_SECRET=uma_chave_secreta_qualquer
JWT_EXPIRES_IN=8h

# Servidor
PORT=3000
```

**4.** Inicie o servidor:

```bash
npm start
```

> O terminal deve exibir: `Servidor rodando na porta 3000`

---

## 📱 Configuração do Frontend (Expo)

**1.** Acesse a pasta do frontend:

```bash
cd AppScholar/frontend
```

**2.** Instale as dependências:

```bash
npx expo install
```

**3.** Configure o endereço da API:

Abra o arquivo `src/services/api.js` e altere o `baseURL` para o **IP da sua máquina** na rede local (não use `localhost`):

```js
// src/services/api.js
const api = axios.create({
  baseURL: 'http://SEU_IP_LOCAL:3000', // Ex: http://192.168.1.10:3000
});
```

> 💡 Para descobrir seu IP, execute `ipconfig` (Windows) ou `ifconfig` (Mac/Linux) e use o endereço IPv4 da sua rede Wi-Fi.

**4.** Inicie o projeto:

```bash
npx expo start
```

**5.** Abra o **Expo Go** no celular e escaneie o QR Code exibido no terminal.

---

## 🧪 Guia de Testes para o Professor

Siga este roteiro para avaliar todas as funcionalidades do sistema:

### Passo 1 — Testar como Aluno

1. Faça login com `anderson@fatec.com` / `aluno123`
2. Verifique o **boletim**: notas de P1 (8.5) e Projeto React Native (9.5) com média calculada
3. Verifique a **frequência**: Anderson tem 100% de presença em PDM I
4. Compare com o aluno `arthur.augusto@fatec.com` / `aluno123` que possui faltas e nota baixa (P1: 4.5) — o sistema deve exibir **alerta de reprovação**

### Passo 2 — Testar como Professor

1. Faça login com `andre@fatec.com` / `prof123`
2. Acesse a disciplina **Programação para Dispositivos Móveis I**
3. Realize uma **chamada** para uma nova data
4. Lance uma **nota** de atividade para um aluno
5. Verifique que o professor só tem acesso à sua própria disciplina

### Passo 3 — Testar como Direção

1. Faça login com `direcao@fatec.com` / `diretor123`
2. Verifique a visão administrativa: listagem de alunos, professores e turmas
3. Explore os controles de gestão disponíveis para o perfil

### Passo 4 — Testar como Master

1. Faça login com `master@app.com` / `master123`
2. Confirme que o perfil Master tem **acesso irrestrito** a todas as ferramentas do sistema

---

## 🔑 Credenciais de Acesso

| Perfil | E-mail | Senha | Descrição |
|:---:|:---|:---:|:---|
| 🔴 **Master** | `master@app.com` | `master123` | Acesso total ao sistema |
| 🟠 **Direção** | `direcao@fatec.com` | `diretor123` | Gestão administrativa |
| 🟡 **Professor** | `andre@fatec.com` | `prof123` | Prof. André — PDM I |
| 🟡 **Professor** | `maria.silva@fatec.com` | `prof123` | Profa. Maria — Eng. Software |
| 🟡 **Professor** | `joao.mendes@fatec.com` | `prof123` | Prof. João — Banco de Dados |
| 🟢 **Aluno** | `anderson@fatec.com` | `aluno123` | Aluno com boas notas e presença |
| 🔵 **Aluno** | `arthur.augusto@fatec.com` | `aluno123` | Aluno com faltas e nota baixa |
| 🔵 **Aluno** | `rafael.shinji@fatec.com` | `aluno123` | Aluno com nota máxima |

---

## 📁 Estrutura do Projeto

```
4DSM-ProgramacaoDispositivosMoveis/
│
├── banco_app_scholar.sql        # Script completo do banco de dados
│
└── AppScholar/
    ├── backend/
    │   ├── src/
    │   │   ├── controllers/     # Lógica de negócio por entidade
    │   │   ├── middlewares/     # Autenticação JWT e RBAC
    │   │   ├── routes/          # Definição dos endpoints da API
    │   │   └── database/        # Conexão com o PostgreSQL
    │   ├── .env                 # Variáveis de ambiente (não versionado)
    │   └── package.json
    │
    └── frontend/
        ├── src/
        │   ├── screens/         # Telas por perfil de usuário
        │   ├── components/      # Componentes reutilizáveis
        │   ├── services/        # Configuração do Axios (api.js)
        │   └── context/         # Contexto de autenticação
        └── package.json
```

---

<div align="center">

---

Desenvolvido por **Anderson Fontes Fernandes Júnior**

**Fatec Jacareí · Desenvolvimento de Software Multiplataforma · 4º Semestre · 2026**

*Projeto acadêmico — Disciplina: Programação para Dispositivos Móveis I*  
*Prof. André Olímpio*

</div>
