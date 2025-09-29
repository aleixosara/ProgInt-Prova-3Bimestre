import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"; // Novo: Rotas de CRUD


const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API CRUD JWT JSON rodando!");
});

// Rotas de Autenticação (Públicas)
app.use("/auth", authRoutes);

// Rotas de Usuários (Protegidas) - Note que elas usam o prefixo /users
app.use("/users", userRoutes);

// Porta
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Configuração para uso do Canvas
// Se você estivesse usando Firebase, faria: setLogLevel('Debug');