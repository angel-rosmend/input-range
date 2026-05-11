const express = require('express');
const app = express();
const port = 4000;

app.get('/range', (req, res) => {
  const mode = req.query.mode || 'normal';
   switch (mode) {
    case 'normal':
      return res.json({ min: 1, max: 10000 });
    case 'fixed':
     return res.json({ rangeValues: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] });
     default:
      return res.status(400).json({ error: 'Invalid mode' });
   }
});

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});