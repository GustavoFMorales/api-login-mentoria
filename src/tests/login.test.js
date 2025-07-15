import request from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
dotenv.config();

describe("Login dados corretos", () => {
    describe("POST /login", () => {
        it("Deve retornar 200 com token quando login e senha estão corretos", async () => {
            const response = await request('http://localhost:3000')
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
                const response = await request('http://localhost:3000')
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
                const response = await request('http://localhost:3000')
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
                const response = await request('http://localhost:3000')
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
})