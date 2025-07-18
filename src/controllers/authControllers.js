import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { enviarCodigo } from '../utils/email.js';

// Carregar variáveis de ambiente
dotenv.config();

// Chave secreta para assinar o token
const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_secreta";

// Caminho absoluto para o arquivo users.json
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const usersFile = path.join(__dirname, "../data/users.json");

// Carrega os usuários do arquivo JSON
const carregaUsuarios = () => {
    try {
        const data = fs.readFileSync(usersFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        return [];
    }
};

// Salva os usuários no arquivo JSON
const salvaUsuariosJson = (usuarios) => {
    try {
        fs.writeFileSync(usersFile, JSON.stringify(usuarios, null, 2));
    } catch (error) {
        console.error("Erro ao salvar usuários:", error);
        throw new Error("Erro ao salvar dados do usuário");
    }
};

// Rota de cadastro de usuário
export const registrar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const usuarios = carregaUsuarios();

        const usuarioExistente = usuarios.find(usuario => usuario.email === email);
        if (usuarioExistente) {
            return res.status(400).json({ error: "Usuário já cadastrado" });
        }

        // Criptografar a senha
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const novoUsuario = {
            id: usuarios.length + 1,
            nome,
            email,
            senha: senhaCriptografada,
        };

        usuarios.push(novoUsuario);
        salvaUsuariosJson(usuarios);

        res.status(201).json({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Rota de login de usuário
export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: "Email e senha são obrigatórios" });
        }

        const usuariosLogin = carregaUsuarios();

        // Verifica se o usuário existe
        const usuarioLogin = usuariosLogin.find(usuario => usuario.email === email);

        if (!usuarioLogin) {
            return res.status(401).json({ error: "Usuário não encontrado" });
        }

        // Usuário bloqueado
        if (usuarioLogin.bloqueado) {
            return res.status(401).json({ error: "Usuário bloqueado" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioLogin.senha);

        if (!senhaCorreta) {
            usuarioLogin.tentativasFalhas = (usuarioLogin.tentativasFalhas || 0) + 1;
            if (usuarioLogin.tentativasFalhas >= 3) {
                usuarioLogin.bloqueado = true;
                salvaUsuariosJson(usuariosLogin);
                return res.status(401).json({ error: "Usuário bloqueado" });
            }
            salvaUsuariosJson(usuariosLogin);
            return res.status(401).json({ error: "Senha incorreta" });
        }

        // Login bem-sucedido: resetar tentativas
        usuarioLogin.tentativasFalhas = 0;
        salvaUsuariosJson(usuariosLogin);

        // Gerar o token JWT
        const token = jwt.sign(
            { id: usuarioLogin.id, nome: usuarioLogin.nome, email: usuarioLogin.email },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login realizado com sucesso", token });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Rota de recuperação de senha
export const recuperarSenha = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email é obrigatório" });
        }

        const usuarios = carregaUsuarios();

        const usuario = usuarios.find(u => u.email === email);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const codigo = Math.floor(100000 + Math.random() * 900000); // Ex: 872319
        usuario.codigoRecuperacao = String(codigo);

        salvaUsuariosJson(usuarios);

        try {
            await enviarCodigo(email, codigo);
            res.json({ message: 'Código de recuperação enviado para seu e-mail.' });
        } catch (err) {
            console.error("Erro ao enviar email:", err);
            res.status(500).json({ error: 'Erro ao enviar e-mail' });
        }
    } catch (error) {
        console.error("Erro na recuperação de senha:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// Redefinir senha 
export const redefinirSenha = async (req, res) => {
    try {
        const { email, codigo, novaSenha } = req.body;

        if (!email || !codigo || !novaSenha) {
            return res.status(400).json({ error: 'Informe email, código e nova senha.' });
        }

        const usuarios = carregaUsuarios();
        const usuario = usuarios.find(u => u.email === email);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        if (usuario.codigoRecuperacao !== codigo) {
            return res.status(401).json({ error: 'Código inválido.' });
        }

        const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
        usuario.senha = senhaCriptografada;
        usuario.codigoRecuperacao = null;

        salvaUsuariosJson(usuarios);

        res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
        console.error("Erro na redefinição de senha:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }


};

export const listaUsuarios = async (req, res) => {
    try {
        const usuarios = carregaUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};