// backend/controllers/adminController.js
const db = require('../database/db');
const bcrypt = require('bcrypt');

const adminController = {
    // =========================================================
    // 1. CADASTRO DE USUÁRIOS
    // =========================================================
    async cadastrarProfessor(req, res) {
        const { email, senha, nome, titulacao, area } = req.body;
        try {
            await db.query('BEGIN');
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);
            const userRes = await db.query(
                "INSERT INTO usuarios (email, senha_hash, perfil) VALUES ($1, $2, 'professor') RETURNING id",
                [email, senhaHash]
            );
            const profRes = await db.query(
                "INSERT INTO professores (usuario_id, nome, titulacao, area) VALUES ($1, $2, $3, $4) RETURNING *",
                [userRes.rows[0].id, nome, titulacao, area]
            );
            await db.query('COMMIT');
            res.status(201).json({ mensagem: 'Professor cadastrado!', professor: profRes.rows[0] });
        } catch (erro) {
            await db.query('ROLLBACK');
            res.status(500).json({ erro: erro.message });
        }
    },

    // ✅ ATUALIZADO: aceita curso_id para vinculação com a tabela cursos
    async cadastrarAluno(req, res) {
        const { email, senha, nome, matricula, curso, semestre, curso_id } = req.body;
        try {
            await db.query('BEGIN');
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);
            const userRes = await db.query(
                "INSERT INTO usuarios (email, senha_hash, perfil) VALUES ($1, $2, 'aluno') RETURNING id",
                [email, senhaHash]
            );

            // Se curso_id informado, busca o nome do curso para preencher a coluna texto
            let cursoNome = curso || null;
            if (curso_id) {
                const cursoRes = await db.query('SELECT nome FROM cursos WHERE id = $1', [curso_id]);
                if (cursoRes.rows.length > 0) cursoNome = cursoRes.rows[0].nome;
            }

            const alunoRes = await db.query(
                `INSERT INTO alunos (usuario_id, nome, matricula, curso, semestre, curso_id)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [userRes.rows[0].id, nome, matricula, cursoNome, semestre || null, curso_id || null]
            );
            await db.query('COMMIT');
            res.status(201).json({ mensagem: 'Aluno cadastrado!', aluno: alunoRes.rows[0] });
        } catch (erro) {
            await db.query('ROLLBACK');
            res.status(500).json({ erro: erro.message });
        }
    },

    // =========================================================
    // 2. GESTÃO DE DISCIPLINAS
    // =========================================================
    async cadastrarDisciplina(req, res) {
        const { nome, professor_id = null, curso = 'DSM', carga_horaria = 80, semestre = null, dia_semana = null, horario_inicio = null, horario_fim = null, sala = null } = req.body;
        if (!nome) return res.status(400).json({ erro: 'O nome da disciplina é obrigatório.' });

        try {
            const novaDisciplina = await db.query(
                `INSERT INTO disciplinas (nome, professor_id, curso, carga_horaria, semestre, dia_semana, horario_inicio, horario_fim, sala) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [nome, professor_id, curso, carga_horaria, semestre, dia_semana, horario_inicio, horario_fim, sala]
            );
            res.status(201).json(novaDisciplina.rows[0]);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    async atualizarDisciplina(req, res) {
        const { id } = req.params;
        const { nome, curso, carga_horaria, semestre, dia_semana, horario_inicio, horario_fim, sala } = req.body;
        
        try {
            const busca = await db.query('SELECT * FROM disciplinas WHERE id = $1', [id]);
            if (busca.rows.length === 0) return res.status(404).json({ erro: 'Disciplina não encontrada.' });
            
            const d = busca.rows[0];

            const novoNome = nome !== undefined ? nome : d.nome;
            const novoCurso = curso !== undefined ? curso : d.curso;
            const novaCarga = carga_horaria !== undefined ? carga_horaria : d.carga_horaria;
            const novoSemestre = semestre !== undefined ? semestre : d.semestre;
            const novoDia = dia_semana !== undefined ? dia_semana : d.dia_semana;
            const novoInicio = horario_inicio !== undefined ? horario_inicio : d.horario_inicio;
            const novoFim = horario_fim !== undefined ? horario_fim : d.horario_fim;
            const novaSala = sala !== undefined ? sala : d.sala;

            const updateQuery = `
                UPDATE disciplinas 
                SET nome = $1, curso = $2, carga_horaria = $3, semestre = $4, 
                    dia_semana = $5, horario_inicio = $6, horario_fim = $7, sala = $8
                WHERE id = $9 RETURNING *
            `;
            
            const result = await db.query(updateQuery, [
                novoNome, novoCurso, novaCarga, novoSemestre, novoDia, novoInicio, novoFim, novaSala, id
            ]);

            res.json({ mensagem: 'Disciplina atualizada com sucesso!', disciplina: result.rows[0] });
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // =========================================================
    // 3. ACESSOS E LISTAGENS
    // =========================================================
    async listarUsuarios(req, res) {
        try {
            const usuarios = await db.query(`SELECT u.id, u.email, u.perfil, COALESCE(a.nome, p.nome, 'Usuário') as nome, a.matricula, p.titulacao FROM usuarios u LEFT JOIN alunos a ON u.id = a.usuario_id LEFT JOIN professores p ON u.id = p.usuario_id ORDER BY u.perfil, nome`);
            res.json(usuarios.rows);
        } catch (erro) { res.status(500).json({ erro: erro.message }); }
    },
    async excluirUsuario(req, res) {
        try { await db.query('DELETE FROM usuarios WHERE id = $1', [req.params.id]); res.json({ mensagem: 'Removido!' }); } 
        catch (erro) { res.status(500).json({ erro: erro.message }); }
    },
    async atualizarUsuario(req, res) {
        const { id } = req.params; const { email, nome, senha, perfil } = req.body;
        try {
            await db.query('BEGIN');
            if (senha) {
                const salt = await bcrypt.genSalt(10); const senhaHash = await bcrypt.hash(senha, salt);
                await db.query('UPDATE usuarios SET email = $1, senha_hash = $2 WHERE id = $3', [email, senhaHash, id]);
            } else { await db.query('UPDATE usuarios SET email = $1 WHERE id = $2', [email, id]); }
            if (perfil === 'aluno') await db.query('UPDATE alunos SET nome = $1 WHERE usuario_id = $2', [nome, id]);
            else if (perfil === 'professor') await db.query('UPDATE professores SET nome = $1 WHERE usuario_id = $2', [nome, id]);
            await db.query('COMMIT');
            res.json({ mensagem: 'Atualizado!' });
        } catch (erro) { await db.query('ROLLBACK'); res.status(500).json({ erro: erro.message }); }
    },
    
    // ✅ ATUALIZADO: inclui join com cursos e retorna curso_id + curso_nome
    async listarAlunos(req, res) {
        try {
            const query = `
                SELECT a.*,
                       c.id   AS curso_id,
                       c.nome AS curso_nome,
                       COALESCE(
                           JSON_AGG(
                               JSON_BUILD_OBJECT('id', d.id, 'nome', d.nome, 'curso', d.curso)
                           ) FILTER (WHERE d.id IS NOT NULL),
                           '[]'
                       ) AS disciplinas_matriculadas
                FROM alunos a
                LEFT JOIN cursos c ON a.curso_id = c.id
                LEFT JOIN aluno_disciplina ad ON a.id = ad.aluno_id
                LEFT JOIN disciplinas d ON ad.disciplina_id = d.id
                GROUP BY a.id, c.id, c.nome
                ORDER BY a.nome
            `;
            const alunos = await db.query(query);
            res.json(alunos.rows);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // ✅ ATUALIZADO: salva curso_id e sincroniza campo texto curso
    async atualizarAluno(req, res) {
        const { id } = req.params;
        const { nome, matricula, curso, semestre, curso_id } = req.body;
        
        try {
            const busca = await db.query('SELECT * FROM alunos WHERE id = $1', [id]);
            if (busca.rows.length === 0) return res.status(404).json({ erro: 'Aluno não encontrado.' });
            
            const a = busca.rows[0];

            const novoNome     = nome      !== undefined ? nome      : a.nome;
            const novaMatricula= matricula !== undefined ? matricula : a.matricula;
            const novoSemestre = semestre  !== undefined && semestre !== '' ? parseInt(semestre) : a.semestre;

            // Resolução do campo curso e curso_id
            let novoCursoId   = curso_id  !== undefined ? (curso_id || null) : a.curso_id;
            let novoCursoText = curso     !== undefined ? curso               : a.curso;

            // Se um curso_id foi fornecido, sincroniza o campo texto automaticamente
            if (curso_id !== undefined && curso_id) {
                const cursoRes = await db.query('SELECT nome FROM cursos WHERE id = $1', [curso_id]);
                if (cursoRes.rows.length > 0) novoCursoText = cursoRes.rows[0].nome;
            }

            const result = await db.query(
                `UPDATE alunos
                 SET nome = $1, matricula = $2, curso = $3, semestre = $4, curso_id = $5
                 WHERE id = $6 RETURNING *`,
                [novoNome, novaMatricula, novoCursoText, novoSemestre, novoCursoId, id]
            );
            res.json({ mensagem: 'Aluno atualizado com sucesso!', aluno: result.rows[0] });
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    async listarProfessores(req, res) {
        try { const professores = await db.query("SELECT * FROM professores ORDER BY nome"); res.json(professores.rows); } 
        catch (erro) { res.status(500).json({ erro: erro.message }); }
    },
    async listarDisciplinas(req, res) {
        try { const disciplinas = await db.query(`SELECT d.*, p.nome as professor_nome FROM disciplinas d LEFT JOIN professores p ON d.professor_id = p.id ORDER BY d.nome`); res.json(disciplinas.rows); } 
        catch (erro) { res.status(500).json({ erro: erro.message }); }
    },

    // =========================================================
    // 4. VINCULAR E DESVINCULAR PROFESSOR A DISCIPLINA
    // =========================================================
    async vincularProfessorDisciplina(req, res) {
        try { await db.query('UPDATE disciplinas SET professor_id = $1 WHERE id = $2', [req.body.professor_id, req.body.disciplina_id]); res.json({ mensagem: 'Professor vinculado!' }); } 
        catch (erro) { res.status(500).json({ erro: erro.message }); }
    },
    async desvincularProfessorDisciplina(req, res) {
        try { await db.query('UPDATE disciplinas SET professor_id = NULL WHERE id = $1', [req.params.disciplina_id]); res.json({ mensagem: 'Professor desvinculado!' }); } 
        catch (erro) { res.status(500).json({ erro: erro.message }); }
    },

    // =========================================================
    // 5. VINCULAR, DESVINCULAR E LISTAR ALUNOS POR DISCIPLINA
    // =========================================================
    async matricularAluno(req, res) {
        try {
            await db.query('INSERT INTO aluno_disciplina (aluno_id, disciplina_id) VALUES ($1, $2)', [req.body.aluno_id, req.body.disciplina_id]);
            res.json({ mensagem: 'Aluno matriculado com sucesso!' });
        } catch (erro) {
            if (erro.code === '23505') return res.status(400).json({ erro: 'O aluno já está matriculado nesta disciplina.' });
            res.status(500).json({ erro: erro.message });
        }
    },
    async desmatricularAluno(req, res) {
        try { await db.query('DELETE FROM aluno_disciplina WHERE aluno_id = $1 AND disciplina_id = $2', [req.params.aluno_id, req.params.disciplina_id]); res.json({ mensagem: 'Aluno desmatriculado!' }); } 
        catch (erro) { res.status(500).json({ erro: erro.message }); }
    },
    async listarAlunosDaDisciplina(req, res) {
        try {
            const result = await db.query(`SELECT a.* FROM alunos a JOIN aluno_disciplina ad ON a.id = ad.aluno_id WHERE ad.disciplina_id = $1 ORDER BY a.nome`, [req.params.disciplina_id]);
            res.json(result.rows);
        } catch (erro) { res.status(500).json({ erro: erro.message }); }
    },

    // =========================================================
    // 6. GESTÃO DE SOLICITAÇÕES
    // =========================================================
    async listarSolicitacoes(req, res) {
        try { 
            const result = await db.query(`
                SELECT s.*, a.nome as aluno_nome, d.nome as disciplina_nome 
                FROM solicitacoes s 
                JOIN alunos a ON s.aluno_id = a.id 
                LEFT JOIN disciplinas d ON s.disciplina_id = d.id 
                ORDER BY s.data_solicitacao DESC
            `); 
            res.json(result.rows); 
        } 
        catch (erro) { res.status(500).json({ erro: erro.message }); }
    },
    
    async responderSolicitacao(req, res) {
        try {
            await db.query('BEGIN');
            const { status, resposta } = req.body;

            const att = await db.query(
                'UPDATE solicitacoes SET status = $1, resposta = $2 WHERE id = $3 RETURNING *', 
                [status, resposta || null, req.params.id]
            );
            
            const sol = att.rows[0];

            if (status === 'Aprovado' && sol.tipo === 'Matrícula' && sol.disciplina_id) {
                await db.query('INSERT INTO aluno_disciplina (aluno_id, disciplina_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [sol.aluno_id, sol.disciplina_id]);
            }
            
            await db.query('COMMIT');
            res.json({ mensagem: `Pedido respondido como: ${status}` });
        } catch (erro) { 
            await db.query('ROLLBACK'); 
            res.status(500).json({ erro: erro.message }); 
        }
    }
};

module.exports = adminController;
