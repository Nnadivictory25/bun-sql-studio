#!/usr/bin/env bun
import { spawn } from "bun";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const configPath = path.join(process.cwd(), "bun-sql-studio.json");
if (!fs.existsSync(configPath)) {
  console.error("❌ bun-sql-studio.json not found");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const { dialect, dbUrl, port = 4987 } = config;

// Environment
process.env.DIALECT = dialect;
process.env.DB_URL = dbUrl;
process.env.PORT = String(port);

// Start server
console.log("🚀 Starting Bun SQL Studio");
console.log(`🗄️  Dialect: ${dialect}`);
console.log(`📍 DB URL: ${dbUrl}`);
console.log(`🌐 Port: ${port}`);

const serverPath = path.join(__dirname, "server.js");

const server = spawn({
  cmd: ["bun", serverPath],
  stdio: ["inherit", "inherit", "inherit"],
  env: process.env,
});

process.on("SIGINT", () => {
  server.kill();
  process.exit(0);
});

await server.exited;
