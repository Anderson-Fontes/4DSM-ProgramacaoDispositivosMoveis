const express = require('express');
const router = express.Router();
const academicoController = require('../controllers/academicoController');
const { verificarToken, checarPerfil } = require('../middlewares/authMiddleware');

router.use(verificarToken);

// Grade Semanal: Todos
router.get('/grade', checarPerfil(['aluno', 'professor', 'diretor']), academicoController.gradeSemanal);

// Boletim: Apenas Alunos
router.get('/boletim', checarPerfil(['aluno']), academicoController.verBoletim);

// Solicitações: Apenas Alunos
router.post('/solicitacoes', checarPerfil(['aluno']), academicoController.novaSolicitacao);

module.exports = router;