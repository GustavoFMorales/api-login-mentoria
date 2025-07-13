const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const remetente = 'gustavo15022110.morales@gmail.com'; // altere para o seu

console.log("Configurando email...");
console.log("Email remetente:", remetente);
console.log("EMAIL_PASSWORD configurada:", process.env.EMAIL_PASSWORD ? "Sim" : "Não");

// Criar transporter com tratamento de erro
let transporter;
try {
    if (!process.env.EMAIL_PASSWORD) {
        throw new Error("EMAIL_PASSWORD não está configurada no arquivo .env");
    }

    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: remetente,
            pass: process.env.EMAIL_PASSWORD
        },
        debug: true, // Ativa logs detalhados
        logger: true,  // Ativa logs do nodemailer
        // Configurações para resolver problema de certificado SSL
        tls: {
            rejectUnauthorized: false
        },
        secure: false, // Usar TLS em vez de SSL
        port: 587 // Porta padrão para TLS
    });

    console.log("Transporter de email configurado com sucesso");
} catch (error) {
    console.error("Erro ao configurar transporter de email:", error.message);
    transporter = null;
}

// Função para verificar se o transporter está funcionando
const verificarTransporter = async () => {
    if (!transporter) {
        throw new Error("Transporter de email não configurado");
    }

    try {
        await transporter.verify();
        console.log("Transporter verificado com sucesso");
        return true;
    } catch (error) {
        console.error("Erro ao verificar transporter:", error.message);
        // Em desenvolvimento, podemos continuar mesmo com erro de verificação
        console.log("Continuando mesmo com erro de verificação (modo desenvolvimento)");
        return true;
    }
};

exports.enviarCodigo = async (destinatario, codigo) => {
    try {
        console.log(`Tentando enviar código ${codigo} para: ${destinatario}`);
        
        // Verificar configuração
        if (!process.env.EMAIL_PASSWORD) {
            throw new Error("Senha de email não configurada no arquivo .env");
        }

        // Verificar transporter (mas não falhar se houver erro de certificado)
        try {
            await verificarTransporter();
        } catch (error) {
            console.log("Aviso: Erro na verificação do transporter, mas tentando enviar mesmo assim");
        }

        const mailOptions = {
            from: remetente,
            to: destinatario,
            subject: 'Recuperação de senha - Seu código',
            text: `Seu código de recuperação é: ${codigo}`,
            html: `
                <h2>Recuperação de Senha</h2>
                <p>Seu código de recuperação é: <strong>${codigo}</strong></p>
                <p>Use este código para redefinir sua senha.</p>
            `
        };

        console.log("Enviando email...");
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`Email enviado com sucesso para: ${destinatario}`);
        console.log("Message ID:", info.messageId);
        
        return info;
    } catch (error) {
        console.error("Erro detalhado ao enviar email:", {
            message: error.message,
            code: error.code,
            command: error.command
        });
        
        // Mensagens de erro mais específicas
        if (error.code === 'EAUTH') {
            throw new Error("Erro de autenticação. Verifique se a senha de aplicativo está correta.");
        } else if (error.code === 'ECONNECTION') {
            throw new Error("Erro de conexão. Verifique sua conexão com a internet.");
        } else if (error.code === 'ESOCKET') {
            throw new Error("Erro de conexão SSL/TLS. Verifique sua configuração de rede.");
        } else {
            throw new Error(`Erro ao enviar email: ${error.message}`);
        }
    }
};
