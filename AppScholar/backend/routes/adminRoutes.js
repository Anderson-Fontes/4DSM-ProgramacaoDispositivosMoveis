const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verificarToken, checarPerfil } = require('../middlewares/authMiddleware');

// Todas as rotas desta página exigem token.
// Como nosso middleware já deixa o 'master' passar direto, só precisamos barrar quem não for 'diretor'
router.use(verificarToken, checarPerfil(['diretor']));

// Rotas de Cadastro (POST)
router.post('/professores', adminController.cadastrarProfessor);
router.post('/alunos', adminController.cadastrarAluno);
router.post('/disciplinas', adminController.cadastrarDisciplina);

// Rotas de Gerenciamento (GET, PUT, DELETE)
router.get('/usuarios', adminController.listarUsuarios);
router.put('/usuarios/:id', adminController.atualizarUsuario);
router.delete('/usuarios/:id', adminController.excluirUsuario);

module.exports = router;