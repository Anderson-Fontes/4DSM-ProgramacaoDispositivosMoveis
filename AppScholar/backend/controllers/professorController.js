const db = require('../database/db');

const professorController = {
    // Lista as matérias que o professor logado dá aula
    async minhasDisciplinas(req, res) {
        try {
            const query = `
                SELECT d.* FROM disciplinas d
                JOIN professores p ON d.professor_id = p.id
                WHERE p.usuario_id = $1
            `;
            const result = await db.query(query, [req.usuario.id]);
            res.json(result.rows);
        } catch (e) { 
            res.status(500).json({ erro: e.message }); 
        }
    },

    // Busca os alunos matriculados no curso daquela disciplina
    async alunosDaTurma(req, res) {
        const { disciplina_id } = req.params;
        try {
            const query = `
                SELECT al.id, al.nome, al.matricula 
                FROM alunos al
                JOIN disciplinas d ON al.curso = d.curso
                WHERE d.id = $1
                ORDER BY al.nome
            `;
            const result = await db.query(query, [disciplina_id]);
            res.json(result.rows);
        } catch (e) { 
            res.status(500).json({ erro: e.message }); 
        }
    },

    // Salva a chamada no banco
    async registarChamada(req, res) {
        const { disciplina_id, data_aula, presencas } = req.body;
        try {
            await db.query('BEGIN');
            for (let p of presencas) {
                await db.query(
                    "INSERT INTO chamadas (disciplina_id, aluno_id, data_aula, presente) VALUES ($1, $2, $3, $4)",
                    [disciplina_id, p.aluno_id, data_aula, p.presente]
                );
            }
            await db.query('COMMIT');
            res.json({ mensagem: 'Chamada salva' });
        } catch (e) { 
            await db.query('ROLLBACK');
            res.status(500).json({ erro: e.message }); 
        }
    },

    // A MÁGICA ACONTECE AQUI: Salva ou atualiza as notas
    async lancarNota(req, res) {
        const { disciplina_id, nome_atividade, notas } = req.body;
        
        try {
            await db.query('BEGIN');

            // 1. Procura se a atividade já existe. Se não, cria na hora!
            let atividadeRes = await db.query(
                "SELECT id FROM atividades WHERE disciplina_id = $1 AND nome = $2",
                [disciplina_id, nome_atividade]
            );

            let atividade_id;
            if (atividadeRes.rows.length === 0) {
                const insertAtv = await db.query(
                    "INSERT INTO atividades (disciplina_id, nome, peso_percentual) VALUES ($1, $2, 100) RETURNING id",
                    [disciplina_id, nome_atividade]
                );
                atividade_id = insertAtv.rows[0].id;
            } else {
                atividade_id = atividadeRes.rows[0].id;
            }

            // 2. Lança as notas de cada aluno
            for (let item of notas) {
                // Só salva se o professor digitou alguma nota para aquele aluno
                if (item.nota !== '' && item.nota !== null && item.nota !== undefined) {
                    // O "ON CONFLICT" garante que, se já houver nota nessa atividade, ele apenas atualiza!
                    await db.query(`
                        INSERT INTO notas_atividades (atividade_id, aluno_id, nota)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (atividade_id, aluno_id)
                        DO UPDATE SET nota = EXCLUDED.nota
                    `, [atividade_id, item.aluno_id, parseFloat(item.nota)]);
                }
            }

            await db.query('COMMIT');
            res.json({ mensagem: 'Notas salvas com sucesso!' });
        } catch (e) {
            await db.query('ROLLBACK');
            console.log("Erro ao lançar notas:", e);
            res.status(500).json({ erro: e.message });
        }
    }
};

module.exports = professorController;