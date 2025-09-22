import db from "../db.json";

export const getAllDados = ((req, res) => {
    console.log("Função getAllDados foi chamada!");
    res.json(db);
});