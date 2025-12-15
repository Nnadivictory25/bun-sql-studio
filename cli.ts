#!/usr/bin/env bun
import { spawn } from "bun";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config loading with Drizzle fallback
async function loadConfig() {
  const cwd = process.cwd();

  // Try Drizzle config first
  const drizzleTsPath = path.join(cwd, "drizzle.config.ts");
  const drizzleJsPath = path.join(cwd, "drizzle.config.js");

  let drizzleConfig: any = null;

  // Try TypeScript config first
  if (fs.existsSync(drizzleTsPath)) {
    try {
      // Bun can handle TypeScript imports
      const module = await import(drizzleTsPath);
      drizzleConfig = module.default || module;
      console.log("✅ Found TypeScript Drizzle config, using database settings from there");
    } catch (e: any) {
      console.log("⚠️  Could not read TypeScript Drizzle config:", e.message);
    }
  }

  // Try JavaScript config
  if (!drizzleConfig && fs.existsSync(drizzleJsPath)) {
    try {
      const module = await import(drizzleJsPath);
      drizzleConfig = module.default || module;
      console.log("✅ Found JavaScript Drizzle config, using database settings from there");
    } catch (e) {
      console.log("⚠️  Could not read JavaScript Drizzle config");
    }
  }

  // Extract config from Drizzle
  if (drizzleConfig && drizzleConfig.dialect === "sqlite" && drizzleConfig.dbCredentials?.url) {
    return {
      dialect: "sqlite",
      dbUrl: drizzleConfig.dbCredentials.url,
      port: 4987
    };
  }

  // Fallback to bun-sql-studio.json
  const studioConfigPath = path.join(cwd, "bun-sql-studio.json");
  if (!fs.existsSync(studioConfigPath)) {
    console.error("❌ No Drizzle config found and bun-sql-studio.json not found");
    console.error("   Create bun-sql-studio.json or set up a Drizzle config");
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(studioConfigPath, "utf-8"));
  return {
    dialect: config.dialect || "sqlite",
    dbUrl: config.dbUrl,
    port: config.port || 4987
  };
}

const config = await loadConfig();
const { dialect, dbUrl, port } = config;

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
