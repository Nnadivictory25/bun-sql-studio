# Bun SQL Studio

A modern SQL database interface specifically built for Bun runtime. Browse SQLite tables, run queries, and inspect JSON data using Bun's native SQLite driver for maximum performance.

## Why Bun SQL Studio?

Setting up a database interface on a fresh server or VPS can be frustrating. Traditional tools like BetterSQLite require Python dependencies, complex installations, and system-level changes. Bun SQL Studio eliminates this hassle:

- **Zero Dependencies**: No Python, no system libraries, no compilation headaches
- **One-Command Setup**: `bunx bun-sql-studio` works instantly on any Bun-enabled environment
- **Built for Modern Runtimes**: Leverages Bun's native SQLite support for lightning-fast performance
- **Server-Ready**: Perfect for development, staging, and production environments

Stop wrestling with database tools. Get a professional SQLite interface in seconds.

## Quick Start

**One command to get started:**

```bash
bunx bun-sql-studio
```

That's it! The studio detects your Drizzle config or uses defaults, and starts at `http://localhost:4987`.

### Optional: Custom Configuration

Create `bun-sql-studio.json` for custom settings:

```json
{
	"dialect": "sqlite",
	"dbUrl": "./database.sqlite",
	"port": 4987
}
```

### Configuration

The studio automatically detects your database settings from:

- **Drizzle config** (`drizzle.config.ts` or `drizzle.config.js`) - zero-config for existing projects
- **Studio config** (`bun-sql-studio.json`) - create this only if no Drizzle config exists

```json
{
	"dialect": "sqlite",
	"dbUrl": "./database.sqlite",
	"port": 4987
}
```

## Features

- **Zero-Config**: Auto-detects Drizzle config for instant setup
- **Table Browser**: View all tables with column information
- **Query Runner**: Execute SELECT queries with results table
- **JSON Viewer**: Inspect JSON columns with expandable modal
- **Column Resizing**: Drag to resize table columns
- **Pagination**: Navigate large datasets efficiently
- **Responsive Design**: Works on desktop and mobile

## Configuration

| Option    | Type   | Default  | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| `dialect` | string | "sqlite" | Database type (sqlite only for now) |
| `dbUrl`   | string | required | Path to SQLite database file        |
| `port`    | number | 4987     | Server port                         |

## Requirements

- Bun 👍

## Troubleshooting

**"bun-sql-studio.json not found"**

- Ensure config file exists in current directory
- Check file name and JSON syntax

**Database connection errors**

- Verify `dbUrl` path is correct
- Ensure database file exists and is readable

**Port already in use**

- Change `port` in config or free the port

## License

MIT
