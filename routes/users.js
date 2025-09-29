import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { listAllUsers, getUserById, updateUser, deleteUser } from '../controllers/usersController.js';

const router = Router();

// Todas as rotas abaixo são protegidas pelo middleware
router.use(authMiddleware);

// GET /users → listar todos os usuários (rota protegida).
router.get('/', listAllUsers);

// GET /users/:id → buscar um usuário específico por id (rota protegida).
router.get('/:id', getUserById);

// PUT /users/:id → atualizar dados de um usuário (rota protegida).
router.put('/:id', updateUser);

// DELETE /users/:id → remover usuário (rota protegida).
router.delete('/:id', deleteUser);

export default router;