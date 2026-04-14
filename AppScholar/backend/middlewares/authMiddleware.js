const jwt = require('jsonwebtoken');

// 1. Verifica se o token existe e é válido
const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(403).json({ erro: 'Nenhum token fornecido.' });
    }

    // O padrão é "Bearer <token>", então dividimos a string
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: 'Token inválido ou expirado.' });
        }
        
        // Salva os dados do usuário na requisição para usarmos depois
        req.usuario = decoded;
        next();
    });
};

// 2. Verifica se o perfil do usuário tem permissão
const checarPerfil = (perfisPermitidos) => {
    return (req, res, next) => {
        // Se não tiver usuário logado, barra na hora
        if (!req.usuario) {
            return res.status(403).json({ erro: 'Acesso negado. Usuário não autenticado.' });
        }

        // 👑 REGRA DO MASTER: Se for o desenvolvedor, ele tem "God Mode". Passa direto!
        if (req.usuario.perfil === 'master') {
            return next();
        }

        // Para os reles mortais, verifica se o perfil está na lista permitida da rota
        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ erro: 'Acesso negado. Perfil sem permissão.' });
        }
        
        next();
    };
};

module.exports = { verificarToken, checarPerfil };