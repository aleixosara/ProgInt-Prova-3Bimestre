import { Router } from 'express';
import { getAllDados } from '../controllers/usersController.js';

const rota = Router();

// rota para retornar os dados
rota.get('/', getAllDados);

export default rota;