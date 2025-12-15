import { Database } from "bun:sqlite";

export async function getSchema(db: Database) {
    const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        .all() as { name: string }[];

    const tablesWithColumns = tables.map(table => {
        const tableColumns = db
            .prepare("SELECT name, type, [notnull] FROM pragma_table_info(?)")
            .all(table.name) as { name: string; type: string; notnull: number }[];

        return {
            name: table.name,
            columns: tableColumns.map(column => ({
                name: column.name,
                type: column.type,
                nullable: !column.notnull,
            })),
        };
    });
    return tablesWithColumns;
}

export function getTables(db: Database) {
    return db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        .all() as { name: string }[];
}

export function getTableData({ db, tableName, limit, offset }: {
    db: Database;
    tableName: string;
    limit: number;
    offset: number;
}) {
    // Validate table exists
    const tables = getTables(db);
    if (!tables.some(t => t.name === tableName)) {
        throw new Error("Table not found");
    }

    // Get columns
    const columns = db
        .prepare("SELECT name, type, [notnull] FROM pragma_table_info(?)")
        .all(tableName) as { name: string; type: string; notnull: number }[];

    // Get total count
    const totalRows = db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as { count: number };

    // Get rows
    const rows = db.prepare(`SELECT * FROM ${tableName} LIMIT ? OFFSET ?`).all(limit, offset);

    return {
        columns: columns.map(col => ({
            name: col.name,
            type: col.type,
            nullable: !col.notnull,
        })),
        rows,
        totalRows: totalRows.count,
    };
}

export const withCors = (response: Response) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
    };

    // Handle preflight requests
    if (response.status === 204) {
        return new Response(null, {
            status: 204,
            headers: corsHeaders
        });
    }

    // Add CORS headers to existing response
    const headers = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
    });

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
};