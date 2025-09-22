import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authMiddleware from "../middleware/auth.js";
import { error } from "console";

const router = Router();

// Banco de Dados em Memória
const users = [];

// Rota de Registro
router.post("/register", async(req, res) => {
    const {username, password} = req.body;

    const userExist = users.find((u) => u.username === username);
    if(userExist){
        return res.status(400).json({message:"Usuário já existe"});
    }
    
    const hashePassword = await bcrypt.hash(password, 10);

    users.push({username, password:hashePassword});
    res.json({message:"Usuário registrado com sucesso"})
});

// Rota de Login
router.post("/login", async (req, res) => {
    const {username, email, password} = req.body;

    const user = users.find((u) => u.username === username);
    if(!user) {
        return res.status(400).json({message:"Usuário não encontrado"});
    }

    const isEmailValid = await bcrypt.compare(email, user.email);
    if(!isEmailValid) {
        return res.status(400).json({message:"E-mail inválido"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(400).json({message:"Senha inválida"})
    }
    
    const token = jwt.sign({username}, "secreta123",
        {expiresIn:"1h"});
        res.json({token});
})

// Rota Listar Usuários (Protegida)
router.get("/profile", authMiddleware, (req, res) => {

    for (let index = 0; index < users.length; index++) {
        users[index] = res.json({message: req.user.username})
    }
    
});


// Rota de Busca Por ID
router.get("/searchID", authMiddleware, (req, res) => {
    const id = req.body;

    const idExist = users.find((u) => u.id != idExist);
    if(idExist){
        return res.status(400).json({message:"ID não encontrado ou inexistente"});
    } else {
        return res.json({message: req.user.username})
    }
});

// Rota de Atualização
router.post("/update", async(req, res) => {
    const username = req.body;

    const userExist = users.find((u) => u.username === username);
    if(userExist){
        const hashePassword = await bcrypt.hash(password, 10);
        users.put({username, email, password:hashePassword});
        res.json({message:"Registro atualizado com sucesso!"})
    }
    
    res.json({message: "Usuário não encontrado"}) 
});

// Rota de Exclusão
router.delete("/delete", async(req, res) => {
    const username = req.body;

    const userExist = users.find((u) => u.username === username);
    if(userExist){
        users.delete({username, email, password:hashePassword});
        res.json({message:"Conta deletada com sucesso!"})
    }
    
    res.json({message: "Usuário não encontrado"}) 
});

export default router;