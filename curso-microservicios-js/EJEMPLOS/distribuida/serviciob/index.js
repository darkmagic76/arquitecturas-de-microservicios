// orders-service/index.js
import express from 'express';
import axios from 'axios';
const app = express();

app.get('/orders', async (req, res) => {
  const { data: users } = await axios.get('http://localhost:3001/users');
  res.json([{ orderId: 100, user: users[0].name, total: 59.90 }]);
});

app.listen(3002, () => console.log('Orders service en puerto 3002'));