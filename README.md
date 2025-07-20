# API de Autenticação

Uma API REST completa para autenticação de usuários com funcionalidades de cadastro, login, recuperação e redefinição de senha.

## 🚀 Funcionalidades

- ✅ Cadastro de usuários
- ✅ Login com JWT
- ✅ Recuperação de senha via email
- ✅ Redefinição de senha com código de verificação
- ✅ Criptografia de senhas com bcrypt
- ✅ Validação de dados
- ✅ Armazenamento em JSON
- ✅ Documentação Swagger/OpenAPI

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **bcrypt** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT
- **nodemailer** - Envio de emails
- **dotenv** - Variáveis de ambiente
- **Swagger/OpenAPI** - Documentação da API

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd mentoria-projeto-api-login
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Configurações de Email
EMAIL_PASSWORD=sua_senha_de_app_aqui

# Configurações do JWT
JWT_SECRET=minha_chave_secreta_super_segura

# Configurações do Servidor
PORT=3000
```

**Importante:** Para o email funcionar, você precisa:
- Usar uma senha de aplicativo do Gmail (não a senha normal)
- Ativar a verificação em duas etapas na sua conta Google
- Gerar uma senha de aplicativo específica para este projeto

4. Execute o servidor:
```bash
# Produção
npm start

# Desenvolvimento (com auto-reload)
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Documentação Swagger

A documentação interativa da API está disponível em:
**http://localhost:3000/api-docs**

### Recursos da Documentação:
- ✅ Interface interativa para testar endpoints
- ✅ Exemplos de requisições e respostas
- ✅ Schemas detalhados dos objetos
- ✅ Códigos de status HTTP
- ✅ Descrições completas de cada endpoint

## 🔗 Endpoints da API

### 1. Cadastro de Usuário
```
POST /auth/cadastrar
```

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "message": "Usuário cadastrado com sucesso"
}
```

### 2. Login
```
POST /auth/login
```

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Observação:** Após 3 tentativas de senha incorreta, o usuário será bloqueado e não poderá mais realizar login até ser desbloqueado manualmente.

**Exemplos de erro:**

- Usuário bloqueado:
```json
{
  "error": "Usuário bloqueado"
}
```
- Senha incorreta:
```json
{
  "error": "Senha incorreta"
}
```
- Usuário não encontrado:
```json
{
  "error": "Usuário não encontrado"
}
```

### 3. Recuperação de Senha
```
POST /auth/recuperar
```

**Body:**
```json
{
  "email": "joao@email.com"
}
```

**Resposta:**
```json
{
  "message": "Código de recuperação enviado para seu e-mail."
}
```

### 4. Redefinir Senha
```
POST /auth/redefinir
```

**Body:**
```json
{
  "email": "joao@email.com",
  "codigo": "123456",
  "novaSenha": "novaSenha123"
}
```

**Resposta:**
```json
{
  "message": "Senha redefinida com sucesso!"
}
```

### 5. Teste de Email
```
POST /auth/teste-email
```

**Body:**
```json
{
  "email": "teste@email.com"
}
```

**Resposta:**
```json
{
  "message": "Email de teste enviado com sucesso!",
  "codigo": "123456"
}
```

### 6. Listar Usuários
```
GET /auth/usuarios
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "$2b$10$..."
  },
  {
    "id": 2,
    "nome": "Maria Souza",
    "email": "maria@email.com",
    "senha": "$2b$10$..."
  }
]
```

## 📁 Estrutura do Projeto

```
src/
├── config/
│   └── swagger.js           # Configuração do Swagger
├── controllers/
│   └── authControllers.js   # Lógica de negócio
├── data/
│   └── users.json          # Armazenamento de usuários
├── routes/
│   └── authRoutes.js       # Definição das rotas
├── utils/
│   └── email.js            # Configuração de email
└── index.js                # Arquivo principal
```

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Tokens JWT para autenticação
- ✅ Validação de dados de entrada
- ✅ Códigos de recuperação temporários
- ✅ Variáveis de ambiente para configurações sensíveis
- ✅ Tratamento de erros SSL/TLS

## 🧪 Testando a API

### Opção 1: Swagger UI (Recomendado)
1. Acesse: `http://localhost:3000/api-docs`
2. Teste os endpoints diretamente na interface
3. Veja exemplos e documentação completa

### Opção 2: Ferramentas Externas
- Postman
- Insomnia
- curl
- Thunder Client (VS Code)

### Exemplo com curl:

```bash
# Cadastrar usuário
curl -X POST http://localhost:3000/auth/cadastrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","senha":"123456"}'

# Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","senha":"123456"}'
```

## 🚀 Scripts Disponíveis

```bash
npm start          # Inicia o servidor em produção
npm run dev        # Inicia o servidor em desenvolvimento (com auto-reload)
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

**Gustavo Morales**
- Email: joao@email.com
- GitHub: [@seu-usuario](https://github.com/seu-usuario) 