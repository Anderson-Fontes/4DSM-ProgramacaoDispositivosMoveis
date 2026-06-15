// backend/controllers/cursosController.js
const db = require('../database/db');

const cursosController = {

    // =============================================================
    // GET /api/admin/cursos — Lista todos os cursos
    // =============================================================
    async listarCursos(req, res) {
        try {
            const result = await db.query(`
                SELECT c.*,
                       COUNT(a.id) AS total_alunos
                FROM cursos c
                LEFT JOIN alunos a ON a.curso_id = c.id
                GROUP BY c.id
                ORDER BY c.nome
            `);
            res.json(result.rows);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // =============================================================
    // GET /api/admin/cursos/:id — Busca um curso por ID
    // =============================================================
    async buscarCurso(req, res) {
        try {
            const result = await db.query(
                'SELECT * FROM cursos WHERE id = $1',
                [req.params.id]
            );
            if (result.rows.length === 0)
                return res.status(404).json({ erro: 'Curso não encontrado.' });
            res.json(result.rows[0]);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // =============================================================
    // POST /api/admin/cursos — Cadastra um novo curso
    // =============================================================
    async cadastrarCurso(req, res) {
        const { nome, area, duracao, coordenador, etec, tipo } = req.body;

        if (!nome || nome.trim() === '')
            return res.status(400).json({ erro: 'O nome do curso é obrigatório.' });

        const tiposValidos = ['Bacharelado', 'Tecnólogo', 'Técnico', 'ETEC'];
        if (tipo && !tiposValidos.includes(tipo))
            return res.status(400).json({ erro: 'Tipo inválido. Use: Bacharelado, Tecnólogo, Técnico ou ETEC.' });

        try {
            const result = await db.query(
                `INSERT INTO cursos (nome, area, duracao, coordenador, etec, tipo)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [nome.trim(), area || null, duracao || null, coordenador || null, etec || null, tipo || null]
            );
            res.status(201).json({ mensagem: 'Curso cadastrado com sucesso!', curso: result.rows[0] });
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // =============================================================
    // PUT /api/admin/cursos/:id — Atualiza um curso existente
    // =============================================================
    async atualizarCurso(req, res) {
        const { id } = req.params;
        const { nome, area, duracao, coordenador, etec, tipo } = req.body;

        const tiposValidos = ['Bacharelado', 'Tecnólogo', 'Técnico', 'ETEC'];
        if (tipo && !tiposValidos.includes(tipo))
            return res.status(400).json({ erro: 'Tipo inválido. Use: Bacharelado, Tecnólogo, Técnico ou ETEC.' });

        try {
            const busca = await db.query('SELECT * FROM cursos WHERE id = $1', [id]);
            if (busca.rows.length === 0)
                return res.status(404).json({ erro: 'Curso não encontrado.' });

            const c = busca.rows[0];

            const result = await db.query(
                `UPDATE cursos
                 SET nome        = $1,
                     area        = $2,
                     duracao     = $3,
                     coordenador = $4,
                     etec        = $5,
                     tipo        = $6
                 WHERE id = $7 RETURNING *`,
                [
                    nome        !== undefined ? nome.trim() : c.nome,
                    area        !== undefined ? area        : c.area,
                    duracao     !== undefined ? duracao     : c.duracao,
                    coordenador !== undefined ? coordenador : c.coordenador,
                    etec        !== undefined ? etec        : c.etec,
                    tipo        !== undefined ? tipo        : c.tipo,
                    id
                ]
            );
            res.json({ mensagem: 'Curso atualizado com sucesso!', curso: result.rows[0] });
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // =============================================================
    // DELETE /api/admin/cursos/:id — Remove um curso
    // =============================================================
    async excluirCurso(req, res) {
        const { id } = req.params;
        try {
            // Desvincula alunos antes de remover
            await db.query('UPDATE alunos SET curso_id = NULL WHERE curso_id = $1', [id]);
            const result = await db.query(
                'DELETE FROM cursos WHERE id = $1 RETURNING id',
                [id]
            );
            if (result.rows.length === 0)
                return res.status(404).json({ erro: 'Curso não encontrado.' });
            res.json({ mensagem: 'Curso removido com sucesso!' });
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },
};

module.exports = cursosController;