const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Acesso negado.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        res.status(400).json({ erro: 'Token inválido.' });
    }
};

const checarPerfil = (perfisPermitidos) => {
    return (req, res, next) => {
        if (req.usuario.perfil === 'master') return next();
        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ erro: 'Permissão insuficiente.' });
        }
        next();
    };
};

module.exports = { verificarToken, checarPerfil };