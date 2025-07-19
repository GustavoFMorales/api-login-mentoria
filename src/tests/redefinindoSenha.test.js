import request from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Configurar __dirname para ES6 modules
const __filename = fileURLToPath(import.meta.url); // Obtém o caminho do arquivo atual
const __dirname = dirname(__filename); // Obtém o diretório do arquivo atual

describe("Redefinir Senha", () => {
    describe("POST /auth/redefinir", () => {
        it("Deve redefinir senha com código válido do arquivo", async () => {
            const emailTeste = "gustavo050899.morales@gmail.com";
            
            // 1. Primeiro solicitar código de recuperação
            const recuperarResponse = await request('http://localhost:3000')
                .post('/auth/recuperar')
                .set('Content-Type', 'application/json')
                .send({
                    "email": emailTeste
                });
            
            expect(recuperarResponse.status).to.equal(200);
            
            // 2. Ler o arquivo para pegar o código gerado
            const usersFile = path.join(__dirname, "../data/users.json"); // Caminho para o arquivo users.json
            const usersData = JSON.parse(fs.readFileSync(usersFile, "utf8")); // Lê os dados do arquivo
            const usuario = usersData.find(user => user.email === emailTeste); // Encontra o usuário pelo email
            
            expect(usuario).to.not.be.undefined; // Verifica se o usuário existe
            expect(usuario.codigoRecuperacao).to.not.be.null; // Verifica se o código de recuperação não é nulo
            expect(usuario.codigoRecuperacao).to.be.a('string'); // Verifica se o código é uma string
            
            console.log(`Código de recuperação encontrado: ${usuario.codigoRecuperacao}`); // Log do código para verificação
            
            // 3. Usar o código para redefinir a senha
            const redefinirResponse = await request('http://localhost:3000')
                .post('/auth/redefinir')
                .set('Content-Type', 'application/json')
                .send({
                    "email": emailTeste,
                    "codigo": usuario.codigoRecuperacao, // Usando o código do arquivo
                    "novaSenha": "novaSenha123"
                });
            
            expect(redefinirResponse.status).to.equal(200);
            expect(redefinirResponse.body.message).to.equal("Senha redefinida com sucesso!");
            
            // 4. Verificar se o código foi removido do arquivo
            const usersDataAfter = JSON.parse(fs.readFileSync(usersFile, "utf8"));
            const usuarioAfter = usersDataAfter.find(user => user.email === emailTeste);
            expect(usuarioAfter.codigoRecuperacao).to.be.null;
        });

        it("Deve retornar 401 com código inválido", async () => {
            const response = await request('http://localhost:3000')
                .post('/auth/redefinir')
                .set('Content-Type', 'application/json')
                .send({
                    "email": "gustavo050899.morales@gmail.com",
                    "codigo": "999999", // Código inválido
                    "novaSenha": "novaSenha123"
                });
            
            expect(response.status).to.equal(401);
            expect(response.body.error).to.equal("Código inválido.");
        });

        it("Deve retornar 404 quando usuário não existe", async () => {
            const response = await request('http://localhost:3000')
                .post('/auth/redefinir')
                .set('Content-Type', 'application/json')
                .send({
                    "email": "naoexiste@email.com",
                    "codigo": "123456",
                    "novaSenha": "novaSenha123"
                });
            
            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("Usuário não encontrado.");
        });

        it("Deve retornar 400 quando dados estão ausentes", async () => {
            const response = await request('http://localhost:3000')
                .post('/auth/redefinir')
                .set('Content-Type', 'application/json')
                .send({
                    "email": "gustavo050899.morales@gmail.com",
                    // codigo ausente
                    "novaSenha": "novaSenha1234"
                });
            
            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("Informe email, código e nova senha.");
        });
    });
});