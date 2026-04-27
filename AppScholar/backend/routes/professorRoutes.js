const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const { verificarToken, checarPerfil } = require('../middlewares/authMiddleware');

router.use(verificarToken);

// Chamada: Professor e Diretor
router.get('/minhas-disciplinas', checarPerfil(['professor', 'diretor']), professorController.minhasDisciplinas);
router.get('/turma/:disciplina_id', checarPerfil(['professor', 'diretor']), professorController.alunosDaTurma);
router.post('/chamada', checarPerfil(['professor', 'diretor']), professorController.registarChamada);

// Lançar Notas: Apenas Professor
router.post('/notas', checarPerfil(['professor']), professorController.lancarNota);

module.exports = router;