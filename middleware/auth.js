import jwt from "jsonwebtoken";

// O segredo do JWT. Em um projeto real, isso estaria em uma variável de ambiente (.env)
const JWT_SECRET = "secreta123";

/**
 * Middleware para proteger rotas.
 * Verifica a presença e a validade do JWT.
 */
function authMiddleware(req, res, next) {
    // 1. Pega o cabeçalho de autorização (Bearer <token>)
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "Token de autenticação não fornecido. Acesso negado." });
    }

    // 2. Extrai o token
    const token = authHeader.split(" ")[1];

    try {
        // 3. Verifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 4. Anexa os dados do usuário (id/email) à requisição
        req.user = decoded;
        
        // 5. Continua para o próximo middleware/controlador
        next();
    } catch (err) {
        // Token inválido, expirado, ou outro erro de verificação
        console.error("JWT Verification Error:", err.message);
        res.status(401).json({ message: "Token inválido ou expirado. Faça login novamente." });
    }
}

export default authMiddleware;