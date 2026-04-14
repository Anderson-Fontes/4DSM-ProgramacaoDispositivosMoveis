require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database/db'); // Conecta ao banco de dados ao iniciar

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const academicoRoutes = require('./routes/academicoRoutes');

const app = express();

// Middlewares globais
// Configuração do CORS para aceitar o Localtunnel e nosso app web
app.use(cors({
    origin: '*', // Permite que qualquer site faça requisições
    allowedHeaders: ['Content-Type', 'Authorization', 'Bypass-Tunnel-Reminder'] // Libera nosso cabeçalho secreto!
}));
app.use(express.json()); // Permite que a API receba JSON no body das requisições

// Configuração das rotas na API
app.use('/api', authRoutes);              // Rotas de login e registro
app.use('/api/admin', adminRoutes);       // Rotas do Diretor (cadastro de alunos/professores)
app.use('/api/academico', academicoRoutes); // Rotas de notas, chamadas e boletim

// Rota base para testar se o servidor está online
app.get('/', (req, res) => {
    res.json({ mensagem: 'API do App Scholar rodando perfeitamente! 🚀' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});