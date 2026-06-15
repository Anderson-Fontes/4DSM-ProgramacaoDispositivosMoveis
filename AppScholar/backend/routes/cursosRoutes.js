// backend/routes/cursosRoutes.js
const express = require('express');
const router = express.Router();
const cursosController = require('../controllers/cursosController');
const { verificarToken, checarPerfil } = require('../middlewares/authMiddleware');

router.use(verificarToken);

// Leitura: master, diretor, professor e aluno podem listar cursos
router.get(
    '/',
    checarPerfil(['master', 'diretor', 'professor', 'aluno']),
    cursosController.listarCursos
);
router.get(
    '/:id',
    checarPerfil(['master', 'diretor', 'professor', 'aluno']),
    cursosController.buscarCurso
);

// Escrita: apenas master e diretor
router.post(
    '/',
    checarPerfil(['master', 'diretor']),
    cursosController.cadastrarCurso
);
router.put(
    '/:id',
    checarPerfil(['master', 'diretor']),
    cursosController.atualizarCurso
);
router.delete(
    '/:id',
    checarPerfil(['master', 'diretor']),
    cursosController.excluirCurso
);

module.exports = router;
