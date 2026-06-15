const express = require('express');
const router = express.Router();
const academicoController = require('../controllers/academicoController');
const { verificarToken, checarPerfil } = require('../middlewares/authMiddleware');

router.use(verificarToken);

router.get('/grade', checarPerfil(['aluno', 'professor', 'diretor']), academicoController.gradeSemanal);
router.get('/boletim', checarPerfil(['aluno']), academicoController.verBoletim);

// Rotas de Solicitações do Aluno
router.get('/solicitacoes', checarPerfil(['aluno']), academicoController.minhasSolicitacoes); // NOVO
router.post('/solicitacoes', checarPerfil(['aluno']), academicoController.novaSolicitacao);

module.exports = router;