const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');
const { verificarToken, checarPerfil } = require('../middlewares/authMiddleware');

router.use(verificarToken);

// Chamada: Professor e Diretor
router.get('/minhas-disciplinas', checarPerfil(['professor', 'diretor']), professorController.minhasDisciplinas);
router.get('/turma/:disciplina_id', checarPerfil(['professor', 'diretor']), professorController.alunosDaTurma);
router.post('/chamada', checarPerfil(['professor', 'diretor']), professorController.registarChamada);

// Lançar e Editar Notas: Professor e Diretor (Master tem acesso garantido pelo authMiddleware)
router.post('/notas', checarPerfil(['professor', 'diretor']), professorController.lancarNota);

// Busca de Atividades e Notas antigas para Edição
router.get('/atividades/:disciplina_id', checarPerfil(['professor', 'diretor']), professorController.buscarAtividades);
router.get('/notas/:disciplina_id/:atividade_id', checarPerfil(['professor', 'diretor']), professorController.buscarNotasDaAtividade);

module.exports = router;