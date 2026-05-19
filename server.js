const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: process.env.MESSAGE || "Hola mundo desde Docker v2",
    environment: process.env.NODE_ENV || "development",
    version: process.env.APP_VERSION || "local",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/db", async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.json({
      database: "no configurada",
      message: "DATABASE_URL no está definida. Este endpoint se usa en la Demo 3 con Docker Compose."
    });
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({
      database: "conectada",
      now: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      database: "error",
      message: error.message
    });
  } finally {
    await pool.end();
  }
});

app.listen(port, () => {
  console.log(`App escuchando en puerto ${port}`);
});
