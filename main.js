import express from 'express';
import routes from './app/interfaces/http/routes.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Rotas
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PDV backend'
  });
});

// Start
app.listen(PORT, () => {
  console.log(`PDV backend running on port ${PORT}`);
});
