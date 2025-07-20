import request from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Configurar __dirname para ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// URL do servidor a partir do .env
const SERVER_URL = process.env.SERVER || 'http://localhost:3000';

describe("Cadastro Usuario", () => {
    describe("POST /auth/registrar", () => {
        it("Deve retornar 201 quando o usuário é cadastrado com sucesso", async () => {
            const emailUnico = `lucas${Date.now()}@email.com`; // Email único para evitar conflitos
            
            const response = await request(SERVER_URL)
                .post('/auth/cadastrar')
                .set('Content-Type', 'application/json')
                .send({
                    "nome": "Lucas Silva",
                    "email": emailUnico,
                    "senha": "123456"
                })

            expect(response.status).to.equal(201); // Verifica se o status é 201
            expect(response.body.message).to.equal("Usuário cadastrado com sucesso"); // Verifica se a mensagem de sucesso é a esperada
        })

        it("Deve criptografar a senha corretamente", async () => {
            const emailTeste = `testeCripto${Date.now()}@email.com`; // Email único
            const senhaOriginal = "senhaParaTeste123";
            
            // Cadastrar o usuário
            const response = await request(SERVER_URL)
                .post('/auth/cadastrar')
                .set('Content-Type', 'application/json')
                .send({
                    "nome": "Teste Criptografia",
                    "email": emailTeste,
                    "senha": senhaOriginal
                })

            expect(response.status).to.equal(201);

            // Ler o arquivo users.json para verificar a senha criptografada
            const usersFile = path.join(__dirname, "../data/users.json");
            const usersData = JSON.parse(fs.readFileSync(usersFile, "utf8"));
            
            // Encontrar o usuário recém-criado
            const usuarioCriado = usersData.find(user => user.email === emailTeste);
            
            expect(usuarioCriado).to.not.be.undefined;
            
            // Verificar se a senha foi criptografada
            expect(usuarioCriado.senha).to.not.equal(senhaOriginal); // Senha não deve ser igual à original
            expect(usuarioCriado.senha).to.include("$2b$"); // Deve conter o prefixo do bcrypt
            expect(usuarioCriado.senha.length).to.be.greaterThan(50); // Hash bcrypt tem mais de 50 caracteres
            
            // Verificar se a senha original bate com o hash (usando bcrypt.compare)
            const senhaValida = await bcrypt.compare(senhaOriginal, usuarioCriado.senha);
            expect(senhaValida).to.be.true;
        })
    })

    describe("Usuario já cadastrado", () => {
        describe("POST /auth/registrar", () => {
            it("Deve retornar 400 quando o usuário já está cadastrado", async () => {
                const response = await request(SERVER_URL)
                    .post('/auth/cadastrar')
                    .set('Content-Type', 'application/json')
                    .send({
                        "nome": "Lucas Silva",
                        "email": "lucasSilva@email.com",
                        "senha": "123456"
                    })
                expect(response.status).to.equal(400); // Verifica se o status é 400
                expect(response.body.error).to.equal("Usuário já cadastrado"); // Verifica se a mensagem de erro é a esperada
            })
        })
    })

    describe("Dados ausentes", () => {
        describe("POST /auth/registrar", () => {
            it("Deve retornar 400 quando algum campo obrigatório está ausente", async () => {
                const response = await request(SERVER_URL)
                    .post('/auth/cadastrar')
                    .set('Content-Type', 'application/json')
                    .send({
                        "nome": "",
                        "email": "",
                        "senha": ""
                    })

                expect(response.status).to.equal(400); // Verifica se o status é 400
                expect(response.body.error).to.equal("Todos os campos são obrigatórios"); // Verifica se a mensagem de erro é a esperada
            })
        })
    })
})