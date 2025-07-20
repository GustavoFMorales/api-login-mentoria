import request from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Configurar __dirname para ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// URL do servidor a partir do .env
const SERVER_URL = process.env.SERVER || 'http://localhost:3000';

describe("Recuperar Senha", () => {
    describe("POST /auth/recuperar", () => {
        it("Deve retornar 200 quando o email é válido e o código de recuperação é enviado", async () => {
            const response = await request(SERVER_URL)
                .post('/auth/recuperar')
                .set('Content-Type', 'application/json')
                .send({
                    "email": "joao@email.com"
                })
            expect(response.status).to.equal(200); // Verifica se o status é 200
            expect(response.body.message).to.equal("Código de recuperação enviado para seu e-mail."); // Verifica se a mensagem de sucesso é a esperada
        })
    })
    describe("Email não encontrado", () => {
        describe("POST /auth/recuperar", () => {
            it("Deve retornar 404 quando o email não está cadastrado", async () => {
                const response = await request(SERVER_URL)
                    .post('/auth/recuperar')
                    .set('Content-Type', 'application/json')
                    .send({
                        "email": "inexistente@email.com"
                    })
                expect(response.status).to.equal(404); // Verifica se o status é 404
                expect(response.body.error).to.equal("Usuário não encontrado"); // Verifica se a mensagem de erro é a esperada
            })
        })
    });
    describe("E-mail ausente", () => {
        describe("POST /auth/recuperar", () => {
            it("Deve retornar 400 quando o email está ausente", async () => {
                const response = await request(SERVER_URL)
                    .post('/auth/recuperar')
                    .set('Content-Type', 'application/json')
                    .send({})
                expect(response.status).to.equal(400); // Verifica se o status é 400
                expect(response.body.error).to.equal("Email é obrigatório"); // Verifica se a mensagem de erro é a esperada
            })
        })
    })
});



