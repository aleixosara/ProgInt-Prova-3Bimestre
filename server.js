import express from "express";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API rodando!");
  });

// Rotas de Autenticação
app.use("/auth", authRoutes);

// Porta
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));