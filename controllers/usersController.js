import { readDb, writeDb } from '../utils/db.js';
import bcrypt from 'bcryptjs';

// --- R (Read) ---

/**
 * Rota GET /users: Lista todos os usuários. (Protegida)
 */
async function listAllUsers(req, res) {
    const db = await readDb();
    
    // Retorna todos os usuários, mas omite a senha (segurança)
    const safeUsers = db.users.map(u => {
        const { senha, ...userSafeData } = u;
        return userSafeData;
    });

    res.json({ users: safeUsers, count: safeUsers.length });
}

/**
 * Rota GET /users/:id: Busca um usuário específico por ID. (Protegida)
 */
async function getUserById(req, res) {
    const { id } = req.params;

    const db = await readDb();
    const user = db.users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Omite a senha
    const { senha, ...userSafeData } = user;
    res.json(userSafeData);
}

// --- U (Update) ---

/**
 * Rota PUT /users/:id: Atualiza os dados de um usuário. (Protegida)
 * O usuário logado só pode atualizar a si mesmo.
 */
async function updateUser(req, res) {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    
    // Verifica se o usuário logado está tentando atualizar a si mesmo
    if (req.user.id !== id) {
        return res.status(403).json({ message: "Você só pode atualizar seu próprio perfil." });
    }

    const db = await readDb();
    const userIndex = db.users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const userToUpdate = db.users[userIndex];

    // Atualiza nome e email, se fornecidos
    if (nome) userToUpdate.nome = nome;
    if (email) userToUpdate.email = email;

    // Atualiza a senha, se fornecida, e faz o hash
    if (senha) {
        userToUpdate.senha = await bcrypt.hash(senha, 10);
    }

    // Verifica se o novo email já está em uso por outro usuário
    if (email && db.users.some((u, index) => u.email === email && index !== userIndex)) {
        return res.status(400).json({ message: "Este e-mail já está sendo usado por outro usuário." });
    }
    
    // Salva a alteração
    await writeDb(db);
    
    const { senha: _, ...updatedUser } = userToUpdate; // Remove senha antes de enviar
    res.json({ message: "Dados atualizados com sucesso.", user: updatedUser });
}

// --- D (Delete) ---

/**
 * Rota DELETE /users/:id: Remove o usuário. (Protegida)
 * O usuário logado só pode deletar a si mesmo.
 */
async function deleteUser(req, res) {
    const { id } = req.params;
    
    // Verifica se o usuário logado está tentando deletar a si mesmo
    if (req.user.id !== id) {
        return res.status(403).json({ message: "Você só pode deletar seu próprio perfil." });
    }

    const db = await readDb();
    const initialLength = db.users.length;
    
    // Filtra o array, removendo o usuário
    db.users = db.users.filter(u => u.id !== id);

    if (db.users.length === initialLength) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    await writeDb(db);
    res.json({ message: "Usuário removido com sucesso." });
}

export { listAllUsers, getUserById, updateUser, deleteUser };