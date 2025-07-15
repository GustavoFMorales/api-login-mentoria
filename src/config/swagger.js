import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Autenticação',
            version: '1.0.0',
            description: 'API REST completa para autenticação de usuários com funcionalidades de cadastro, login, recuperação e redefinição de senha.',
            contact: {
                name: 'Desenvolvedor',
                email: 'gustavo050899.morales@gmail.com'
            },
            license: {
                name: 'ISC',
                url: 'https://opensource.org/licenses/ISC'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento'
            }
        ],
        components: {
            schemas: {
                Usuario: {
                    type: 'object',
                    required: ['nome', 'email', 'senha'],
                    properties: {
                        nome: {
                            type: 'string',
                            description: 'Nome completo do usuário',
                            example: 'João Silva'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email do usuário',
                            example: 'joao@email.com'
                        },
                        senha: {
                            type: 'string',
                            description: 'Senha do usuário (mínimo 6 caracteres)',
                            example: '123456'
                        }
                    }
                },
                Login: {
                    type: 'object',
                    required: ['email', 'senha'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email do usuário',
                            example: 'joao@email.com'
                        },
                        senha: {
                            type: 'string',
                            description: 'Senha do usuário',
                            example: '123456'
                        }
                    }
                },
                RecuperarSenha: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email do usuário para recuperação',
                            example: 'joao@email.com'
                        }
                    }
                },
                RedefinirSenha: {
                    type: 'object',
                    required: ['email', 'codigo', 'novaSenha'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email do usuário',
                            example: 'joao@email.com'
                        },
                        codigo: {
                            type: 'string',
                            description: 'Código de recuperação enviado por email',
                            example: '123456'
                        },
                        novaSenha: {
                            type: 'string',
                            description: 'Nova senha do usuário',
                            example: 'novaSenha123'
                        }
                    }
                },
                RespostaSucesso: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Mensagem de sucesso'
                        }
                    }
                },
                RespostaLogin: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Mensagem de sucesso'
                        },
                        token: {
                            type: 'string',
                            description: 'Token JWT para autenticação'
                        }
                    }
                },
                Erro: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Mensagem de erro'
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

export default specs; 