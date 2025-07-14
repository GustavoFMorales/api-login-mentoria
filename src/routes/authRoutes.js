const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const { enviarCodigo } = require('../utils/email');

/**
 * @swagger
 * /auth/cadastrar:
 *   post:
 *     summary: Cadastrar novo usuário
 *     description: Cria uma nova conta de usuário com nome, email e senha criptografada
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *           example:
 *             nome: "João Silva"
 *             email: "joao@email.com"
 *             senha: "123456"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaSucesso'
 *             example:
 *               message: "Usuário cadastrado com sucesso"
 *       400:
 *         description: Dados inválidos ou usuário já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             example:
 *               error: "Todos os campos são obrigatórios"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/cadastrar', authController.registrar);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Fazer login
 *     description: |
 *       Autentica um usuário com email e senha, retornando um token JWT.
 *       
 *       **Observação:** Após 3 tentativas de senha incorreta, o usuário será bloqueado e não poderá mais realizar login até ser desbloqueado manualmente.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *           example:
 *             email: "joao@email.com"
 *             senha: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaLogin'
 *             example:
 *               message: "Login realizado com sucesso"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Credenciais inválidas, usuário bloqueado ou não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *             examples:
 *               senha_incorreta:
 *                 summary: Senha incorreta
 *                 value:
 *                   error: "Senha incorreta"
 *               usuario_bloqueado:
 *                 summary: Usuário bloqueado
 *                 value:
 *                   error: "Usuário bloqueado"
 *               usuario_nao_encontrado:
 *                 summary: Usuário não encontrado
 *                 value:
 *                   error: "Usuário não encontrado"
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/recuperar:
 *   post:
 *     summary: Recuperar senha
 *     description: Envia um código de recuperação para o email do usuário
 *     tags: [Recuperação de Senha]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecuperarSenha'
 *           example:
 *             email: "joao@email.com"
 *     responses:
 *       200:
 *         description: Código de recuperação enviado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaSucesso'
 *             example:
 *               message: "Código de recuperação enviado para seu e-mail."
 *       400:
 *         description: Email não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       500:
 *         description: Erro ao enviar email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/recuperar', authController.recuperarSenha);

/**
 * @swagger
 * /auth/redefinir:
 *   post:
 *     summary: Redefinir senha
 *     description: Redefine a senha do usuário usando o código de recuperação
 *     tags: [Recuperação de Senha]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RedefinirSenha'
 *           example:
 *             email: "joao@email.com"
 *             codigo: "123456"
 *             novaSenha: "novaSenha123"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaSucesso'
 *             example:
 *               message: "Senha redefinida com sucesso!"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       401:
 *         description: Código inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/redefinir', authController.redefinirSenha);

/**
 * @swagger
 * /auth/teste-email:
 *   post:
 *     summary: Testar envio de email
 *     description: Rota para testar se o sistema de email está funcionando corretamente
 *     tags: [Teste]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['email']
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email para teste
 *                 example: "teste@email.com"
 *     responses:
 *       200:
 *         description: Email de teste enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email de teste enviado com sucesso!"
 *                 codigo:
 *                   type: string
 *                   description: "Código gerado (apenas para teste)"
 *                   example: "123456"
 *       400:
 *         description: Email não fornecido
 *       500:
 *         description: Erro ao enviar email
 */
router.post('/teste-email', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "Email é obrigatório" });
        }

        console.log("Testando envio de email para:", email);
        
        const codigo = Math.floor(100000 + Math.random() * 900000);
        await enviarCodigo(email, codigo);
        
        res.json({ 
            message: "Email de teste enviado com sucesso!",
            codigo: codigo // Apenas para teste, em produção não enviar o código
        });
    } catch (error) {
        console.error("Erro no teste de email:", error);
        res.status(500).json({ 
            error: "Erro ao enviar email de teste",
            details: error.message 
        });
    }
});

/**
 * @swagger
 * /auth/usuarios:
 *   get:
 *     summary: Listar todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/usuarios', authController.listaUsuarios);

module.exports = router;

