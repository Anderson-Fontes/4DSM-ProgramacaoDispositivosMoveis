const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarToken, checarPerfil } = require('../middlewares/authMiddleware');

// Valida que há um token antes de prosseguir
router.use(verificarToken);

// ================= ROTAS DE LISTAGEM =================
// Alunos: Apenas Diretor e Professor
router.get('/alunos', checarPerfil(['diretor', 'professor']), adminController.listarAlunos);

// Professores: Apenas Diretor
router.get('/professores', checarPerfil(['diretor']), adminController.listarProfessores);

// Disciplinas: Todos
router.get('/disciplinas', checarPerfil(['diretor', 'professor', 'aluno']), adminController.listarDisciplinas);

// Acessos: Apenas Diretor
router.get('/usuarios', checarPerfil(['diretor']), adminController.listarUsuarios);


// ================= ROTAS DE CADASTRO E EDIÇÃO =================
// Apenas Diretor tem poder para criar e apagar contas
router.post('/professores', checarPerfil(['diretor']), adminController.cadastrarProfessor);
router.post('/alunos', checarPerfil(['diretor']), adminController.cadastrarAluno);
router.post('/disciplinas', checarPerfil(['diretor']), adminController.cadastrarDisciplina);
router.put('/usuarios/:id', checarPerfil(['diretor']), adminController.atualizarUsuario);
router.delete('/usuarios/:id', checarPerfil(['diretor']), adminController.excluirUsuario);

module.exports = router;