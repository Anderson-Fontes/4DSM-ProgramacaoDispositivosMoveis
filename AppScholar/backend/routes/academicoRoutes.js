const express = require('express');
const router = express.Router();
const academico = require('../controllers/academicoController');
const { verificarToken, checarPerfil } = require('../middlewares/authMiddleware');

// Professor e Diretor podem gerenciar notas e chamadas
router.post('/atividades', verificarToken, checarPerfil(['professor', 'diretor']), academico.criarAtividade);
router.post('/notas', verificarToken, checarPerfil(['professor', 'diretor']), academico.lancarNota);
router.post('/chamada', verificarToken, checarPerfil(['professor', 'diretor']), academico.registrarPresenca);

// Aluno, Professor e Diretor podem ver o boletim
// Troque a rota antiga por esta:
router.get('/boletim/:aluno_id', verificarToken, academico.obterBoletim);
module.exports = router;