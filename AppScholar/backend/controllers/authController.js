const db = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
    async login(req, res) {
        const { email, senha } = req.body;
        try {
            const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
            if (result.rows.length === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });

            const usuario = result.rows[0];
            const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
            if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta.' });

            const token = jwt.sign(
                { id: usuario.id, perfil: usuario.perfil, email: usuario.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token, usuario: { id: usuario.id, nome: usuario.email, perfil: usuario.perfil } });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    }
};

module.exports = authController;