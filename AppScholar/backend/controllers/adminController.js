const db = require('../database/db');
const bcrypt = require('bcrypt');

const adminController = {
    // 1. Cadastrar um novo Professor
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

    // 2. Cadastrar um novo Aluno
    async cadastrarAluno(req, res) {
        const { email, senha, nome, matricula, curso } = req.body;
        try {
            await db.query('BEGIN');
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);

            const userRes = await db.query(
                "INSERT INTO usuarios (email, senha_hash, perfil) VALUES ($1, $2, 'aluno') RETURNING id",
                [email, senhaHash]
            );
            const alunoRes = await db.query(
                "INSERT INTO alunos (usuario_id, nome, matricula, curso) VALUES ($1, $2, $3, $4) RETURNING *",
                [userRes.rows[0].id, nome, matricula, curso]
            );

            await db.query('COMMIT');
            res.status(201).json({ mensagem: 'Aluno cadastrado!', aluno: alunoRes.rows[0] });
        } catch (erro) {
            await db.query('ROLLBACK');
            res.status(500).json({ erro: erro.message });
        }
    },

    // 3. Cadastrar Disciplina
    async cadastrarDisciplina(req, res) {
        const { nome, professor_id, curso } = req.body;
        try {
            const novaDisciplina = await db.query(
                "INSERT INTO disciplinas (nome, professor_id, curso) VALUES ($1, $2, $3) RETURNING *",
                [nome, professor_id, curso]
            );
            res.status(201).json(novaDisciplina.rows[0]);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // 4. Listar todos os usuários do sistema (Controle de Acessos)
    async listarUsuarios(req, res) {
        try {
            const usuarios = await db.query(`
                SELECT u.id, u.email, u.perfil, 
                       COALESCE(a.nome, p.nome, 'Usuário Sistema') as nome,
                       a.matricula, p.titulacao
                FROM usuarios u
                LEFT JOIN alunos a ON u.id = a.usuario_id
                LEFT JOIN professores p ON u.id = p.usuario_id
                ORDER BY u.perfil, nome
            `);
            res.json(usuarios.rows);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // 5. Excluir Usuário
    async excluirUsuario(req, res) {
        const { id } = req.params;
        try {
            await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
            res.json({ mensagem: 'Usuário removido com sucesso!' });
        } catch (erro) {
            res.status(500).json({ erro: 'Erro ao excluir: ' + erro.message });
        }
    },

    // 6. Editar Usuário
    async atualizarUsuario(req, res) {
        const { id } = req.params;
        const { email, nome, senha, perfil } = req.body;
        
        try {
            await db.query('BEGIN');

            if (senha) {
                const salt = await bcrypt.genSalt(10);
                const senhaHash = await bcrypt.hash(senha, salt);
                await db.query('UPDATE usuarios SET email = $1, senha_hash = $2 WHERE id = $3', [email, senhaHash, id]);
            } else {
                await db.query('UPDATE usuarios SET email = $1 WHERE id = $2', [email, id]);
            }

            if (perfil === 'aluno') {
                await db.query('UPDATE alunos SET nome = $1 WHERE usuario_id = $2', [nome, id]);
            } else if (perfil === 'professor') {
                await db.query('UPDATE professores SET nome = $1 WHERE usuario_id = $2', [nome, id]);
            }

            await db.query('COMMIT');
            res.json({ mensagem: 'Dados atualizados com sucesso!' });
        } catch (erro) {
            await db.query('ROLLBACK');
            res.status(500).json({ erro: erro.message });
        }
    },

    // 7. Listar Alunos com dados completos
    async listarAlunos(req, res) {
        try {
            const alunos = await db.query("SELECT * FROM alunos ORDER BY nome");
            res.json(alunos.rows);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // 8. Listar Professores com dados completos
    async listarProfessores(req, res) {
        try {
            const professores = await db.query("SELECT * FROM professores ORDER BY nome");
            res.json(professores.rows);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    },

    // 9. Listar Disciplinas com o nome do professor vinculado
    async listarDisciplinas(req, res) {
        try {
            const disciplinas = await db.query(`
                SELECT d.*, p.nome as professor_nome 
                FROM disciplinas d 
                LEFT JOIN professores p ON d.professor_id = p.id 
                ORDER BY d.nome
            `);
            res.json(disciplinas.rows);
        } catch (erro) {
            res.status(500).json({ erro: erro.message });
        }
    }
};

module.exports = adminController;