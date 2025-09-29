import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Determina o caminho do arquivo db.json de forma segura em módulos ES (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../db.json');

/**
 * Lê o conteúdo do arquivo db.json.
 * @returns {Promise<object>} Objeto contendo os dados do banco.
 */
async function readDb() {
    try {
        const data = await fs.promises.readFile(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Se o arquivo não existir ou estiver vazio, retorna uma estrutura inicial
        if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
            console.warn("DB file not found or empty. Initializing with empty structure.");
            return { users: [] };
        }
        throw error;
    }
}

/**
 * Escreve o objeto de dados no arquivo db.json.
 * @param {object} data - O objeto completo a ser salvo.
 * @returns {Promise<void>}
 */
async function writeDb(data) {
    await fs.promises.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export { readDb, writeDb };