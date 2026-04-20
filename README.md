# App Scholar - Sistema de Gestão Acadêmica 🎓

O **App Scholar** é uma aplicação Full-Stack desenvolvida para a gestão educacional, permitindo a interação entre alunos, professores e a direção escolar. O projeto foca em segurança, controle de acesso baseado em perfis (RBAC) e visualização de dados acadêmicos em tempo real.

## 🚀 Funcionalidades Principais

* **Controle de Acessos:** Telas dinâmicas que se adaptam conforme o perfil logado (Master, Direção, Professor ou Aluno).
* **Diário de Classe Digital:** Professores podem realizar chamadas e lançar notas de atividades específicas diretamente pelo celular.
* **Boletim Inteligente:** Alunos visualizam médias calculadas automaticamente, detalhamento de notas por atividade e alerta visual de frequência (reprovação por faltas).
* **Gestão Administrativa:** Direção e Master podem gerenciar usuários, disciplinas e turmas.

---

## 🛠️ Tecnologias Utilizadas

**Mobile (Frontend):**
* React Native (Expo)
* React Native Safe Area Context (Layout adaptativo)
* Axios (Integração com API)
* AsyncStorage (Persistência de Token)

**Backend:**
* Node.js com Express
* PostgreSQL (Banco de Dados Relacional)
* JWT (Autenticação Segura)
* Bcrypt (Criptografia de Senhas)

---

## 📥 Instalação e Configuração

### 1. Banco de Dados (PostgreSQL)
1.  Crie um banco de dados chamado `app_scholar`.
2.  Execute o script SQL contido no arquivo `banco_app_scholar.sql` (disponível na raiz do projeto) para criar as tabelas e povoar com os dados de teste.

### 2. Servidor (Backend)
1.  Navegue até a pasta `backend`.
2.  Instale as dependências: `npm install`.
3.  Configure o arquivo `.env` com suas credenciais do banco de dados.
4.  Inicie o servidor: `npm start`.

### 3. Aplicativo (Frontend)
1.  Navegue até a pasta `frontend`.
2.  Instale as dependências: `npx expo install`.
3.  No arquivo `src/services/api.js`, verifique se o `baseURL` aponta para o IP correto da sua máquina.
4.  Inicie o projeto: `npx expo start`.
5.  Abra o **Expo Go** no seu celular e escaneie o QR Code.

---

## 🧪 Guia de Teste (Credenciais)

Para avaliar as diferentes visões do sistema, utilize as contas pré-configuradas abaixo:

| Perfil | E-mail | Senha | O que testar? |
| :--- | :--- | :--- | :--- |
| **Desenvolvedor** | `master@app.com` | `master123` | Acesso total a todas as ferramentas do sistema. |
| **Direção** | `direcao@fatec.com` | `diretor123` | Gestão de alunos, professores e acessos. |
| **Professor** | `andre@fatec.com` | `prof123` | Realizar chamada e lançar notas na matéria de Mobile. |
| **Aluno** | `anderson@fatec.com` | `aluno123` | Ver o boletim detalhado, média e frequência. |

---

## 👨‍💻 Desenvolvedor
* **Nome:** Anderson Fontes Fernandes Júnior
* **Instituição:** Fatec Jacareí
* **Curso:** Desenvolvimento de Software Multiplataforma (DSM)

---
*Este projeto foi desenvolvido para fins acadêmicos como parte da avaliação semestral.*
