const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Cadastro de usuário (vamos usar para criar o 1º diretor ou professores/alunos)
const registrar = async (req, res) => {
    const { email, senha, perfil } = req.body;

    try {
        // Criptografa a senha antes de salvar (nunca salve senha em texto puro!)
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const novoUsuario = await db.query(
            'INSERT INTO usuarios (email, senha_hash, perfil) VALUES ($1, $2, $3) RETURNING id, email, perfil',
            [email, senhaHash, perfil]
        );

        res.status(201).json({ mensagem: 'Usuário criado com sucesso!', usuario: novoUsuario.rows[0] });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao registrar usuário.' });
    }
};

// Login de usuário (Retorna o JWT)
const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Busca o usuário no banco
        const resultado = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        // Compara a senha digitada com a criptografada no banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha incorreta.' });
        }

        // Gera o Token JWT contendo o ID e o Perfil
        const token = jwt.sign(
            { id: usuario.id, perfil: usuario.perfil },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // Token expira em 8 horas
        );

        // Resposta igual a que o professor pediu no PDF
        res.json({
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                perfil: usuario.perfil
            }
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro no servidor ao fazer login.' });
    }
};

module.exports = { registrar, login };