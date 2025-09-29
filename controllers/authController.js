import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from '../utils/db.js';

// Segredo do JWT (Deve ser o mesmo usado no middleware)
const JWT_SECRET = "secreta123";

/**
 * Rota POST /register: Cadastra um novo usuário.
 * Requisito: { nome, email, senha }
 */
async function register(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Nome, e-mail e senha são obrigatórios." });
    }

    const db = await readDb();

    // Verifica se o usuário já existe
    const userExist = db.users.find(u => u.email === email);
    if (userExist) {
        return res.status(400).json({ message: "E-mail já registrado." });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o novo usuário
    const newUser = {
        id: uuidv4(), // Usando UUID para ID
        nome,
        email,
        senha: hashedPassword // Armazena a senha hasheada
    };

    db.users.push(newUser);
    await writeDb(db);

    res.status(201).json({ message: "Usuário registrado com sucesso!", userId: newUser.id });
}

/**
 * Rota POST /login: Autentica o usuário e gera um JWT.
 * Requisito: { email, senha }
 */
async function login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    const db = await readDb();

    // 1. Busca o usuário pelo email
    const user = db.users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // 2. Compara a senha fornecida com a senha hasheada
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // 3. Gera o JWT válido por 1h
    const token = jwt.sign(
        { id: user.id, email: user.email, nome: user.nome }, // Payload
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ message: "Login realizado com sucesso!", token, expires: "1h" });
}

export { register, login };