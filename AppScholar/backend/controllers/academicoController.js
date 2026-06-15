const db = require('../database/db');

const academicoController = {
    // 1. Grade Semanal
    async gradeSemanal(req, res) {
        try {
            const query = `
                SELECT 
                    d.nome, d.dia_semana, d.horario_inicio, d.horario_fim, d.sala,
                    p.nome AS professor_nome
                FROM disciplinas d
                JOIN aluno_disciplina ad ON d.id = ad.disciplina_id
                JOIN alunos a ON ad.aluno_id = a.id
                LEFT JOIN professores p ON d.professor_id = p.id
                WHERE a.usuario_id = $1
                ORDER BY d.dia_semana, d.horario_inicio
            `;
            const result = await db.query(query, [req.usuario.id]);
            res.json(result.rows);
        } catch (e) { 
            res.status(500).json({ erro: e.message }); 
        }
    },

    // 2. Histórico de Solicitações do Aluno (NOVO)
    async minhasSolicitacoes(req, res) {
        try {
            const aluno = await db.query("SELECT id FROM alunos WHERE usuario_id = $1", [req.usuario.id]);
            const result = await db.query("SELECT * FROM solicitacoes WHERE aluno_id = $1 ORDER BY data_solicitacao DESC", [aluno.rows[0].id]);
            res.json(result.rows);
        } catch (e) {
            res.status(500).json({ erro: e.message });
        }
    },

    // 3. Nova Solicitação (Mensagem Livre)
    async novaSolicitacao(req, res) {
        const { mensagem } = req.body;
        if (!mensagem) return res.status(400).json({ erro: 'A mensagem não pode estar vazia.' });

        try {
            const aluno = await db.query("SELECT id FROM alunos WHERE usuario_id = $1", [req.usuario.id]);
            await db.query(
                "INSERT INTO solicitacoes (aluno_id, tipo, mensagem) VALUES ($1, $2, $3)", 
                [aluno.rows[0].id, 'Contato Direção', mensagem]
            );
            res.json({ mensagem: 'Mensagem enviada com sucesso!' });
        } catch (e) { 
            res.status(500).json({ erro: e.message }); 
        }
    },

    // 4. Ver Boletim
    async verBoletim(req, res) {
        try {
            const query = `
                WITH NotasAluno AS (
                    SELECT at.disciplina_id, na.aluno_id, AVG(na.nota) as media_notas, JSON_AGG(JSON_BUILD_OBJECT('nome', at.nome, 'nota', na.nota)) as detalhes
                    FROM atividades at JOIN notas_atividades na ON at.id = na.atividade_id GROUP BY at.disciplina_id, na.aluno_id
                ),
                FrequenciaAluno AS (
                    SELECT c.disciplina_id, c.aluno_id, COUNT(c.id) as total_aulas, SUM(CASE WHEN c.presente = true THEN 1 ELSE 0 END) as presencas, SUM(CASE WHEN c.presente = false THEN 1 ELSE 0 END) as faltas
                    FROM chamadas c GROUP BY c.disciplina_id, c.aluno_id
                )
                SELECT d.nome as disciplina, COALESCE(na.media_notas, 0) as media, na.detalhes as detalhamento, COALESCE(fa.total_aulas, 0) as total_aulas, COALESCE(fa.presencas, 0) as presencas, COALESCE(fa.faltas, 0) as faltas
                FROM disciplinas d JOIN alunos al ON d.curso = al.curso
                LEFT JOIN NotasAluno na ON d.id = na.disciplina_id AND al.id = na.aluno_id
                LEFT JOIN FrequenciaAluno fa ON d.id = fa.disciplina_id AND al.id = fa.aluno_id
                WHERE al.usuario_id = $1 ORDER BY d.nome;
            `;
            const result = await db.query(query, [req.usuario.id]);
            res.json(result.rows);
        } catch (e) {
            res.status(500).json({ erro: e.message });
        }
    }
};

module.exports = academicoController;