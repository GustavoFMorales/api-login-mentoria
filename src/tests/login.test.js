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

describe("Login dados corretos", () => {
    describe("POST /login", () => {
        it("Deve retornar 200 com token quando login e senha estão corretos", async () => {
            const response = await request(SERVER_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({

                    'email': 'joao@email.com',
                    'senha': '123456'

                })
            expect(response.status).to.equal(200); // Verifica se o status é 200
            expect(response.body.token).to.be.a('string'); // Verifica se o token é uma string

        })
    })
    describe("Login dados incorretos", () => {
        describe("POST /login", () => {
            it("Deve retornar 401 quando email ou senha estão incorretos", async () => {
                const response = await request(SERVER_URL)
                    .post('/auth/login')
                    .set('Content-Type', 'application/json')
                    .send({

                        'email': 'joao@email.com',
                        'senha': '12345'
                    })
                expect(response.status).to.equal(401); // Verifica se o status é 401
                expect(response.body.error).to.equal("Senha incorreta"); // Verifica se a mensagem de erro é a esperada 
            })
        })
    })
    describe("Login dados ausentes", () => {
        describe("POST /login", () => {
            it("Deve retornar 400 quando email está ausente", async () => {
                const response = await request(SERVER_URL)
                    .post('/auth/login')
                    .set('Content-Type', 'application/json')
                    .send({
                        'email': '',
                        'senha': '12345'
                    })
                expect(response.status).to.equal(400); // Verifica se o status é 400
                expect(response.body.error).to.equal("Email e senha são obrigatórios"); // Verifica se a mensagem de erro é a esperada
            })

            it("Deve retornar 400 quando senha está ausente", async () => {
                const response = await request(SERVER_URL)
                    .post('/auth/login')
                    .set('Content-Type', 'application/json')
                    .send({
                        'email': 'joao@email.com',
                        'senha': ''
                    })
                expect(response.status).to.equal(400); // Verifica se o status é 400
                expect(response.body.error).to.equal("Email e senha são obrigatórios"); // Verifica se a mensagem de erro é a esperada
            })
        })
    })
    describe("Usuário Bloqueado", () => {
        describe("POST /login", () => {
            before(async () => {
                const loginData = {
                    email: 'gustavo050899.morales@gmail.com',
                    senha: '12345678'
                };
                const app = SERVER_URL;

                for (let i = 0; i < 4; i++) {
                    await request(app)
                        .post('/auth/login')
                        .set('Content-Type', 'application/json')
                        .send({
                            'email': 'gustavo050899.morales@gmail.com',
                            'senha': '12345678'
                        })
                }
            });

            it("Deve retornar 401 quando o usuário está bloqueado", async () => {
                const response = await request(SERVER_URL)
                    .post('/auth/login')
                    .set('Content-Type', 'application/json')
                    .send({
                        'email': 'gustavo050899.morales@gmail.com',
                        'senha': '12345678'
                    })
                expect(response.status).to.equal(401); // Verifica se o status é 401
                expect(response.body.error).to.equal("Usuário bloqueado"); // Verifica se a mensagem está correta
            })

            it("Deve bloquear usuário após 3 tentativas e persistir no arquivo", async () => {
                const emailTeste = `teste${Date.now()}@bloqueio.com`;
                const senhaCorreta = "senhaCorreta123";
                const senhaIncorreta = "senhaErrada";
                
                // 1. Primeiro cadastrar um usuário de teste
                await request(SERVER_URL)
                    .post('/auth/cadastrar')
                    .set('Content-Type', 'application/json')
                    .send({
                        "nome": "Teste Bloqueio",
                        "email": emailTeste,
                        "senha": senhaCorreta
                    });

                // 2. Fazer 3 tentativas com senha incorreta
                for (let i = 0; i < 3; i++) {
                    await request(SERVER_URL)
                        .post('/auth/login')
                        .set('Content-Type', 'application/json')
                        .send({
                            'email': emailTeste,
                            'senha': senhaIncorreta
                        });
                }

                // 3. Verificar se o usuário foi bloqueado no arquivo
                const usersFile = path.join(__dirname, "../data/users.json"); // Caminho para o arquivo users.json
                const usersData = JSON.parse(fs.readFileSync(usersFile, "utf8")); // Lê os dados do arquivo
                const usuarioBloqueado = usersData.find(user => user.email === emailTeste); // Encontra o usuário pelo email
                
                expect(usuarioBloqueado).to.not.be.undefined;
                expect(usuarioBloqueado.bloqueado).to.be.true;
                expect(usuarioBloqueado.tentativasFalhas).to.equal(3);

                // 4. Tentar login com senha correta e verificar bloqueio
                const response = await request(SERVER_URL)
                    .post('/auth/login')
                    .set('Content-Type', 'application/json')
                    .send({
                        'email': emailTeste,
                        'senha': senhaCorreta // Mesmo com senha correta
                    });
                
                expect(response.status).to.equal(401);
                expect(response.body.error).to.equal("Usuário bloqueado");
            })
        })
    })
})