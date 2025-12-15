# Bun SQL Studio

A modern Bun SQL database studio specifically built for Bun runtime. Browse SQLite tables, run queries, and inspect JSON data using Bun's native SQLite (for now).

## Quick Start

1. Create configuration file:

```bash
echo '{
  "dialect": "sqlite",
  "dbUrl": "./database.sqlite",
  "port": 4987
}' > bun-sql-studio.json
```

2. Run the studio:

```bash
bunx bun-sql-studio
```

The studio will start at `http://localhost:4987`.

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
