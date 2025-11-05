// client-service/index.js — pendiente de implementar
import express from "express";
import axios from "axios";
import CircuitBreaker from "opossum";
import amqp from "amqplib";

const app = express();
const PORT = 4001;

const BASE = process.env.UNRELIABLE_URL || "http://unreliable-service:4000";
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://rabbitmq";

/* ============================================================
   🔹 1. LLAMADA BÁSICA
   ============================================================ */
app.get("/test/basic", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE}/sometimes-fails`);
    res.json({ patron: "basic", resultado: data });
  } catch {
    res.status(500).json({ patron: "basic", error: "fallo remoto" });
  }
});

/* ============================================================
   🔹 2. RETRY
   ============================================================ */
async function callWithRetry(url, retries = 5, delay = 300) {
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`🔁 Intento ${i}...`);
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

app.get("/test/retry", async (req, res) => {
  try {
    const data = await callWithRetry(`${BASE}/sometimes-fails`, 3, 500);
    res.json({ patron: "retry", resultado: data });
  } catch {
    res.status(500).json({ patron: "retry", error: "todos los intentos fallaron" });
  }
});

/* ============================================================
   🔹 3. TIMEOUT
   ============================================================ */
const http = axios.create({ timeout: 6000 }); // 2 segundos máx

app.get("/test/timeout", async (req, res) => {
  try {
    const { data } = await http.get(`${BASE}/slow`);
    res.json({ patron: "timeout", resultado: data });
  } catch {
    res.status(504).json({ patron: "timeout", error: "tiempo excedido" });
  }
});

/* ============================================================
   🔹 4. CIRCUIT BREAKER
   ============================================================ */
async function llamadaRemota() {
  const { data } = await axios.get(`${BASE}/sometimes-fails`);
  return data;
}

const breaker = new CircuitBreaker(llamadaRemota, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 5000
});

breaker.on("open", () => console.log("🚨 Circuito ABIERTO"));
breaker.on("halfOpen", () => console.log("⚠️ Circuito HALF-OPEN"));
breaker.on("close", () => console.log("✅ Circuito CERRADO"));

app.get("/test/circuit-breaker", async (req, res) => {
  try {
    const data = await breaker.fire();
    res.json({ patron: "circuit-breaker", resultado: data });
  } catch {
    res.status(503).json({ patron: "circuit-breaker", error: "circuito abierto o fallo remoto" });
  }
});

/* ============================================================
   🔹 5. FALLBACK
   ============================================================ */
let cache = [{ id: 0, name: "usuario cacheado" }];

async function getWithFallback() {
  try {
    const { data } = await axios.get(`${BASE}/sometimes-fails`);
    cache = [data];
    return { origen: "remoto", data };
  } catch {
    return { origen: "fallback", data: cache };
  }
}

app.get("/test/fallback", async (req, res) => {
  const result = await getWithFallback();
  res.json({ patron: "fallback", resultado: result });
});

/* ============================================================
   🔹 6. CONSUMIDOR ASÍNCRONO RABBITMQ
   ============================================================ */
async function listenRabbit() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();
    await ch.assertQueue("pedidos_creados", { durable: true });
    console.log("📥 Escuchando cola 'pedidos_creados'...");
    ch.consume("pedidos_creados", msg => {
      const pedido = JSON.parse(msg.content.toString());
      console.log(`🧾 [Factura] Pedido recibido: ${pedido.id} de ${pedido.user}`);
      ch.ack(msg);
    });
  } catch (e) {
    console.error("❌ Error conectando a RabbitMQ:", e.message);
  }
}



/* ============================================================
   🚀 START
   ============================================================ */
app.listen(PORT, () => {
  console.log(`🧪 Client Service en http://client-service:${PORT}`);
  console.log("Endpoints disponibles:");
  console.log("  - /test/basic");
  console.log("  - /test/retry");
  console.log("  - /test/timeout");
  console.log("  - /test/circuit-breaker");
  console.log("  - /test/fallback");
  listenRabbit();
});