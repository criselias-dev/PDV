// ===============================
// main.js
// Ponto de entrada da aplicação
// Aqui a aplicação é composta:
// - inicializa infraestrutura
// - configura middlewares
// - sobe o servidor HTTP
// ===============================

import express from 'express';

// Rotas HTTP (camada de interface)
import routes from './app/interfaces/http/routes.js';

// Inicialização do banco de dados (infraestrutura)
import { initDatabase } from './app/infrastructure/database/init.js';

// Criação da aplicação Express
const app = express();

// Porta padrão do backend
const PORT = 3000;

// ===============================
// Middlewares globais
// ===============================

// Permite receber JSON no body das requisições
app.use(express.json());

// ===============================
// Inicialização da infraestrutura
// ===============================

// Garante que o banco existe e que o schema foi criado
// Isso roda sempre que o backend sobe
await initDatabase();

// ===============================
// Rotas da aplicação
// ===============================

// Todas as rotas da API ficam sob /api
app.use('/api', routes);

// Endpoint simples de health check
// Usado para verificar se o backend está vivo
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PDV backend'
  });
});

// ===============================
// Inicialização do servidor
// ===============================

app.listen(PORT, () => {
  console.log(`🚀 PDV backend running on port ${PORT}`);
});
