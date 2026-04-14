const db = require('../database/db');

const academicoController = {
    // Professor lança uma nova atividade (ex: P1) com peso
    async criarAtividade(req, res) {
        const { disciplina_id, nome, peso_percentual } = req.body;
        try {
            const novaAtividade = await db.query(
                'INSERT INTO atividades (disciplina_id, nome, peso_percentual) VALUES ($1, $2, $3) RETURNING *',
                [disciplina_id, nome, peso_percentual]
            );
            res.status(201).json(novaAtividade.rows[0]);
        } catch (err) { res.status(500).json({ erro: err.message }); }
    },

    // Lançar nota de um aluno em uma atividade
    async lancarNota(req, res) {
        const { atividade_id, aluno_id, nota } = req.body;
        try {
            await db.query(
                'INSERT INTO notas_atividades (atividade_id, aluno_id, nota) VALUES ($1, $2, $3) ON CONFLICT DO UPDATE SET nota = $3',
                [atividade_id, aluno_id, nota]
            );
            res.json({ mensagem: 'Nota registrada!' });
        } catch (err) { res.status(500).json({ erro: err.message }); }
    },

    // Fazer Chamada
    async registrarPresenca(req, res) {
        const { disciplina_id, aluno_id, presente } = req.body;
        try {
            await db.query(
                'INSERT INTO chamadas (disciplina_id, aluno_id, presente) VALUES ($1, $2, $3)',
                [disciplina_id, aluno_id, presente]
            );
            res.json({ mensagem: 'Presença registrada!' });
        } catch (err) { res.status(500).json({ erro: err.message }); }
    },

// Consulta de Boletim Completo (Substitua a função antiga por esta)
    async obterBoletim(req, res) {
        const { aluno_id } = req.params; // Lendo do usuário logado
        
        try {
            // Verifica qual o ID do aluno correspondente a esse usuario_id
            const alunoQuery = await db.query('SELECT id FROM alunos WHERE usuario_id = $1', [aluno_id]);
            if (alunoQuery.rows.length === 0) return res.json([]);
            
            const idRealAluno = alunoQuery.rows[0].id;

            // Busca todas as disciplinas, calcula a média ponderada e agrupa
            const boletimCompleto = await db.query(`
                SELECT 
                    d.id as disciplina_id,
                    d.nome as disciplina,
                    COALESCE(SUM(n.nota * (a.peso_percentual / 100)), 0) as media,
                    
                    -- Lógica de Frequência
                    COALESCE(
                        (SELECT (SUM(CASE WHEN presente THEN 1 ELSE 0 END)::FLOAT / COUNT(*)) * 100 
                         FROM chamadas c WHERE c.disciplina_id = d.id AND c.aluno_id = $1), 
                    100) as freq_percentual

                FROM disciplinas d
                LEFT JOIN atividades a ON d.id = a.disciplina_id
                LEFT JOIN notas_atividades n ON a.id = n.atividade_id AND n.aluno_id = $1
                GROUP BY d.id, d.nome
            `, [idRealAluno]);

            // Formata a resposta com a "Situação" exigida no App
            const resultadoFormatado = boletimCompleto.rows.map(item => {
                const mediaNum = parseFloat(item.media);
                const freqNum = parseFloat(item.freq_percentual);
                let situacao = 'Em andamento';

                if (mediaNum >= 6 && freqNum >= 75) situacao = 'Aprovado';
                else if (mediaNum < 6 && mediaNum >= 4) situacao = 'Exame';
                else if (mediaNum < 4 || freqNum < 75) situacao = 'Reprovado';

                return {
                    disciplina_id: item.disciplina_id,
                    disciplina: item.disciplina,
                    media: mediaNum.toFixed(2),
                    frequencia: freqNum.toFixed(1) + '%',
                    situacao: situacao
                };
            });

            res.json(resultadoFormatado);
        } catch (err) { res.status(500).json({ erro: err.message }); }
    }
};

module.exports = academicoController;