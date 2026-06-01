const db = require('../database/db');

const academicoController = {
    async gradeSemanal(req, res) {
        try {
            const query = `SELECT nome, dia_semana, horario_inicio, sala FROM disciplinas WHERE curso = (SELECT curso FROM alunos WHERE usuario_id = $1)`;
            const result = await db.query(query, [req.usuario.id]);
            res.json(result.rows);
        } catch (e) { 
            res.status(500).json({ erro: e.message }); 
        }
    },

    async novaSolicitacao(req, res) {
        const { disciplina_id, tipo } = req.body;
        try {
            const aluno = await db.query("SELECT id FROM alunos WHERE usuario_id = $1", [req.usuario.id]);
            await db.query("INSERT INTO solicitacoes (aluno_id, disciplina_id, tipo) VALUES ($1, $2, $3)", [aluno.rows[0].id, disciplina_id, tipo]);
            res.json({ mensagem: 'Solicitação enviada.' });
        } catch (e) { 
            res.status(500).json({ erro: e.message }); 
        }
    },

    async verBoletim(req, res) {
        try {
            // Nova Query SQL Robusta usando CTEs (WITH)
            const query = `
                WITH NotasAluno AS (
                    SELECT 
                        at.disciplina_id,
                        na.aluno_id,
                        AVG(na.nota) as media_notas,
                        JSON_AGG(JSON_BUILD_OBJECT('nome', at.nome, 'nota', na.nota)) as detalhes
                    FROM atividades at
                    JOIN notas_atividades na ON at.id = na.atividade_id
                    GROUP BY at.disciplina_id, na.aluno_id
                ),
                FrequenciaAluno AS (
                    SELECT 
                        c.disciplina_id,
                        c.aluno_id,
                        COUNT(c.id) as total_aulas,
                        SUM(CASE WHEN c.presente = true THEN 1 ELSE 0 END) as presencas,
                        SUM(CASE WHEN c.presente = false THEN 1 ELSE 0 END) as faltas
                    FROM chamadas c
                    GROUP BY c.disciplina_id, c.aluno_id
                )
                SELECT 
                    d.nome as disciplina,
                    COALESCE(na.media_notas, 0) as media,
                    na.detalhes as detalhamento,
                    COALESCE(fa.total_aulas, 0) as total_aulas,
                    COALESCE(fa.presencas, 0) as presencas,
                    COALESCE(fa.faltas, 0) as faltas
                FROM disciplinas d
                JOIN alunos al ON d.curso = al.curso
                LEFT JOIN NotasAluno na ON d.id = na.disciplina_id AND al.id = na.aluno_id
                LEFT JOIN FrequenciaAluno fa ON d.id = fa.disciplina_id AND al.id = fa.aluno_id
                WHERE al.usuario_id = $1
                ORDER BY d.nome;
            `;
            
            const result = await db.query(query, [req.usuario.id]);
            res.json(result.rows);
        } catch (e) {
            console.error("Erro no Boletim:", e); // Mostra o erro exato no terminal do node
            res.status(500).json({ erro: e.message });
        }
    }
};

module.exports = academicoController;