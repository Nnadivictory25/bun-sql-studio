import { serve } from "bun";
import { Database } from "bun:sqlite";
import path from "path";
import { getSchema, getTables, getTableData, withCors } from "./utils";

// Paths
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const TOOL_ROOT = path.resolve(import.meta.dir, "..");
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 4987;
const FRONTEND_DIST_PATH = path.join(__dirname, "frontend");

if (!DB_URL) {
    throw new Error("DB_URL is not set");
}


const db = new Database(DB_URL);

// Bun server
const server = serve({
    port: PORT,
    fetch: async (req) => {
        const url = new URL(req.url);

        // CORS preflight
        if (req.method === 'OPTIONS') {
            return withCors(new Response(null, { status: 204 }));
        }

        // Schema endpoint
        if (url.pathname === '/schema') {
            try {
                const tablesWithColumns = await getSchema(db);
                return withCors(Response.json({ tables: tablesWithColumns }));
            } catch (error: any) {
                console.error("Error getting schema", error);
                return withCors(Response.json({ error: error.message }, { status: 500 }));
            }
        }

        // Query endpoint (read-only)
        if (url.pathname === '/query' && req.method === 'POST') {
            try {
                const { sql } = await req.json() as { sql: string };
                if (!/^\s*(select|pragma|with)\s/i.test(sql)) {
                    return withCors(new Response("Read-only queries only", { status: 403 }));
                }
                const rows = db.prepare(sql).all();
                return withCors(Response.json({ rows }));
            } catch (error: any) {
                return withCors(Response.json({ error: error.message }, { status: 500 }));
            }
        }

        // Tables endpoint
        if (url.pathname === '/tables') {
            try {
                const tables = getTables(db);
                return withCors(Response.json({ tables }));
            } catch (error: any) {
                return withCors(Response.json({ error: error.message }, { status: 500 }));
            }
        }

        // Table data endpoint
        if (url.pathname === '/table-data') {
            try {
                const table = url.searchParams.get('table');
                const limit = parseInt(url.searchParams.get('limit') || '100', 10);
                const offset = parseInt(url.searchParams.get('offset') || '0', 10);

                if (!table) {
                    return withCors(Response.json({ error: 'table parameter required' }, { status: 400 }));
                }

                const data = getTableData({ db, tableName: table, limit, offset });
                return withCors(Response.json(data));
            } catch (error: any) {
                return withCors(Response.json({ error: error.message }, { status: 500 }));
            }
        }

        // Serve frontend files
        let filePath = path.join(FRONTEND_DIST_PATH, url.pathname);
        const fileExists = await Bun.file(filePath).exists();
        if (fileExists) {
            return withCors(new Response(Bun.file(filePath)));
        } else {
            return withCors(new Response(Bun.file(path.join(FRONTEND_DIST_PATH, "index.html"))));
        }
    },
});

console.log(`🚀 Server running at ${server.url}`);


// (async () => {
//     const response = await fetch(`${server.url}/api/schema`);
//     const data = await response.json();
//     await Bun.write("schema.json", JSON.stringify(data, null, 2));
//     console.log("📊 Database schema written to schema.json");
// })();