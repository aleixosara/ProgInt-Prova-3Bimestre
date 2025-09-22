import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];

    if(!authHeader) return res.status(401).json({message:"Token não fornecido"});

    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, "secreta123");
        req.user = decode;
        next();
    } catch (err) {
        res.status(401).json({message:"Token inválido ou expirado"});
    }
}

export default authMiddleware;