const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

console.log("Iniciando aplicação...");

// Carregar variáveis de ambiente
try {
    dotenv.config();
    console.log("Variáveis de ambiente carregadas");
} catch (error) {
    console.error("Erro ao carregar variáveis de ambiente:", error);
}

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`Porta configurada: ${PORT}`);

// Middleware para logs
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
console.log("Middleware JSON configurado");

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API de Autenticação - Documentação"
}));
console.log("Swagger UI configurado em /api-docs");

// Importando as rotas
try {
    console.log("Tentando carregar rotas...");
    const authRoutes = require("./routes/authRoutes");
    app.use("/auth", authRoutes);
    console.log("Rotas de autenticação carregadas com sucesso");
} catch (error) {
    console.error("Erro ao carregar rotas:", error);
}

app.get("/", (req, res) => {
    console.log("Requisição recebida na rota raiz");
    res.json({
        message: "API de autenticação está funcionando",
        documentation: "http://localhost:3000/api-docs",
        endpoints: {
            cadastrar: "POST /auth/cadastrar",
            login: "POST /auth/login",
            recuperar: "POST /auth/recuperar",
            redefinir: "POST /auth/redefinir",
            testeEmail: "POST /auth/teste-email"
        }
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error("Erro na aplicação:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

console.log("Tentando iniciar servidor...");

const server = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
    console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
    console.log("Servidor iniciado com sucesso!");
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
    console.error('Erro não capturado:', err);
    server.close(() => {
        console.log('Servidor fechado devido a erro não capturado');
        process.exit(1);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rejeitada não tratada:', reason);
    server.close(() => {
        console.log('Servidor fechado devido a promise rejeitada');
        process.exit(1);
    });
});

// Tratamento de sinais de encerramento
process.on('SIGTERM', () => {
    console.log('SIGTERM recebido, fechando servidor...');
    server.close(() => {
        console.log('Servidor fechado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT recebido, fechando servidor...');
    server.close(() => {
        console.log('Servidor fechado');
        process.exit(0);
    });
});

console.log("Configuração de eventos de processo concluída");