import { Router } from "express";
import { login, register } from "../controllers/authController.js";

const router = Router();

// POST /register → cadastrar novo usuário.
router.post("/register", register);

// POST /login → autenticação do usuário.
router.post("/login", login);

export default router;