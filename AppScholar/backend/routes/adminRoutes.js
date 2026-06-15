const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarToken, checarPerfil } = require('../middlewares/authMiddleware');

// Valida que há um token antes de prosseguir
router.use(verificarToken);

// ================= ROTAS DE LISTAGEM GERAIS =================
router.get('/alunos', checarPerfil(['diretor', 'professor', 'master']), adminController.listarAlunos);
router.get('/professores', checarPerfil(['diretor', 'master']), adminController.listarProfessores);
router.get('/disciplinas', checarPerfil(['diretor', 'professor', 'aluno', 'master']), adminController.listarDisciplinas);
router.get('/usuarios', checarPerfil(['diretor', 'master']), adminController.listarUsuarios);
router.get('/solicitacoes', checarPerfil(['diretor', 'master']), adminController.listarSolicitacoes);

// ================= ROTAS DE CADASTRO GERAIS =================
router.post('/professores', checarPerfil(['diretor', 'master']), adminController.cadastrarProfessor);
router.post('/alunos', checarPerfil(['diretor', 'master']), adminController.cadastrarAluno);
router.post('/disciplinas', checarPerfil(['diretor', 'master']), adminController.cadastrarDisciplina);

// ================= ROTAS DE VÍNCULO E AÇÕES ESPECÍFICAS =================
router.put('/disciplinas/vincular-professor', checarPerfil(['diretor', 'master']), adminController.vincularProfessorDisciplina);
router.post('/disciplinas/matricular-aluno', checarPerfil(['diretor', 'master']), adminController.matricularAluno);
router.put('/solicitacoes/:id', checarPerfil(['diretor', 'master']), adminController.responderSolicitacao);

// ================= ROTAS DINÂMICAS DE DISCIPLINAS =================
router.put('/disciplinas/:disciplina_id/desvincular-professor', checarPerfil(['diretor', 'master']), adminController.desvincularProfessorDisciplina);
router.delete('/disciplinas/:disciplina_id/aluno/:aluno_id', checarPerfil(['diretor', 'master']), adminController.desmatricularAluno);
router.get('/disciplinas/:disciplina_id/alunos', checarPerfil(['diretor', 'master']), adminController.listarAlunosDaDisciplina);

// ================= ATUALIZAÇÃO E EXCLUSÃO (FICAM POR ÚLTIMO PARA EVITAR CONFLITOS) =================
router.put('/disciplinas/:id', checarPerfil(['diretor', 'master']), adminController.atualizarDisciplina); 
router.put('/alunos/:id', checarPerfil(['diretor', 'master']), adminController.atualizarAluno); // <-- ROTA DE EDITAR O ALUNO
router.put('/usuarios/:id', checarPerfil(['diretor', 'master']), adminController.atualizarUsuario);
router.delete('/usuarios/:id', checarPerfil(['diretor', 'master']), adminController.excluirUsuario);

module.exports = router;