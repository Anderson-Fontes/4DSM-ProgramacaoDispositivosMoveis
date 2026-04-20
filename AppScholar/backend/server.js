const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Importar Rotas
// Rota ajustada para bater exatamente com a exigência do PDF (POST /api/login)
app.use('/api', require('./routes/authRoutes')); 
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/professor', require('./routes/professorRoutes'));
app.use('/api/academico', require('./routes/academicoRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));