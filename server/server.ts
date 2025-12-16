import { serve } from "bun";
import path from "path";
import { getSchema, getTables, getTableData, withCors } from "./utils";
import { createAdapter, type DatabaseDialect } from "./adapters/index";

// Paths
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const DB_URL = process.env.DB_URL;
const DIALECT = process.env.DIALECT as DatabaseDialect;
const PORT = process.env.PORT || 4987;
const FRONTEND_DIST_PATH = path.join(__dirname, "frontend");

if (!DB_URL) {
    throw new Error("DB_URL is not set");
}


if (!DIALECT) {
    throw new Error("DIALECT is not set");
}

const adapter = createAdapter({ dbUrl: DB_URL, dialect: DIALECT });

// Bun server
const server = serve({
    port: PORT,
    fetch: async (req) => {
        const url = new URL(req.url);

        // CORS preflight
        if (req.method === 'OPTIONS') {
            return withCors(new Response(null, { status: 204 }));
        }

        // Meta endpoint
        if (url.pathname === '/meta') {
            try {
                const databaseName = await adapter.getDatabaseName();
                return withCors(Response.json({ 
                    dialect: DIALECT, 
                    databaseName 
                }));
            } catch (error: any) {
                console.error("Error getting metadata", error);
                return withCors(Response.json({ error: error.message }, { status: 500 }));
            }
        }

        // Schema endpoint
        if (url.pathname === '/schema') {
            try {
                const tables = await adapter.getTables();
                const tablesWithColumns = await Promise.all(
                    tables.map(async (table) => ({
                        name: table.name,
                        columns: await adapter.getColumns(table.name)
                    }))
                );
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
                const result = await adapter.executeQuery(sql);
                return withCors(Response.json({ rows: result.rows }));
            } catch (error: any) {
                return withCors(Response.json({ error: error.message }, { status: 500 }));
            }
        }

        // Tables endpoint
        if (url.pathname === '/tables') {
            try {
                const tables = await adapter.getTables();
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

                const [columns, result, totalRows] = await Promise.all([
                    adapter.getColumns(table),
                    adapter.executeQuery(`SELECT * FROM ${table} LIMIT ${limit} OFFSET ${offset}`),
                    adapter.getTotalRows(table)
                ]);

                return withCors(Response.json({
                    columns,
                    rows: result.rows,
                    totalRows
                }));
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