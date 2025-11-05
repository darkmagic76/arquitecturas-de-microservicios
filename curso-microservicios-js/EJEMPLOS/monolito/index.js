import express from 'express';
const app = express();

const users = [{ id: 1, name: "Ana" }, { id: 2, name: "Luis" }];
const orders = [{ id: 100, userId: 1, total: 59.90 }];

// Endpoints mezclados en la misma app
app.get('/users', (req, res) => res.json(users));
app.get('/orders', (req, res) => res.json(orders));

setInterval(() => {console.log('proceso')}, 1000)
setInterval(() => {console.log('proceso2')}, 2000)


app.post('/video', )


app.listen(3000, () => console.log('Servidor monolítico en puerto 3000'));