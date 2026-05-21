const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

function hasDatabaseConfig() {
  return Boolean(process.env.DATABASE_URL);
}

async function getPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

app.get("/", (req, res) => {
  res.json({
    message: "Hola desde Docker en mi VPS1",
    environment: process.env.NODE_ENV || "development",
    database_enabled: hasDatabaseConfig(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database_enabled: hasDatabaseConfig(),
  });
});

app.get("/db", async (req, res) => {
  if (!hasDatabaseConfig()) {
    return res.json({
      database: "no configurada",
      message:
        "La aplicación está funcionando sin base de datos. Define DATABASE_URL para activar PostgreSQL.",
    });
  }

  const pool = await getPool();

  try {
    const result = await pool.query("SELECT NOW() AS now");

    res.json({
      database: "conectada",
      now: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      database: "error",
      message: error.message,
    });
  } finally {
    await pool.end();
  }
});

app.get("/visitas", async (req, res) => {
  if (!hasDatabaseConfig()) {
    return res.json({
      database: "no configurada",
      message:
        "Este endpoint necesita PostgreSQL. En la Demo 3 se activa mediante Docker Compose.",
    });
  }

  const pool = await getPool();

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visitas (
        id SERIAL PRIMARY KEY,
        mensaje TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(
      "INSERT INTO visitas (mensaje) VALUES ($1)",
      ["Visita registrada desde la app Node.js en Docker"]
    );

    const result = await pool.query(`
      SELECT id, mensaje, created_at
      FROM visitas
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      database: "conectada",
      total_ultimas_visitas: result.rows.length,
      visitas: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      database: "error",
      message: error.message,
    });
  } finally {
    await pool.end();
  }
});

app.listen(port, () => {
  console.log(`App escuchando en puerto ${port}`);
});
