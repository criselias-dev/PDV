const express = require('express');

const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PDV backend'
  });
});

app.listen(PORT, () => {
  console.log(`PDV backend running on port ${PORT}`);
});
console.log("PDV backend initialized");