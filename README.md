# Bun SQL Studio v1.0 🎉

**Modern database IDE supporting SQLite, PostgreSQL, and MySQL**

A professional SQL database interface built for Bun runtime. Browse tables, run queries, and inspect data across multiple database types with zero configuration.

## Why Bun SQL Studio?

Bun SQL Studio provides a modern, professional database interface that works across SQLite, PostgreSQL, and MySQL. Unlike traditional tools that require complex setups and dependencies, Bun SQL Studio offers:

- **Multi-Database Support**: Connect to SQLite files, PostgreSQL servers, or MySQL databases
- **Zero Configuration**: Automatic detection of Drizzle configs for instant setup
- **Modern Architecture**: Built with Bun runtime for maximum performance
- **Professional UX**: Table browsing, SQL editing, JSON viewing, and more
- **Production Ready**: Suitable for development, staging, and production environments

Stop wrestling with database tools. Get a professional multi-database IDE in seconds.

## Quick Start

### SQLite (Zero Config)
```bash
bunx bun-sql-studio
```
That's it! The studio detects your Drizzle config or creates a default SQLite database.

### PostgreSQL
```bash
# Using Drizzle config (auto-detected)
export DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
bunx bun-sql-studio

# Or create bun-sql-studio.json
echo '{"dialect": "postgresql", "dbUrl": "postgresql://user:pass@localhost:5432/dbname"}' > bun-sql-studio.json
bunx bun-sql-studio
```

### MySQL
```bash
# Using Drizzle config (auto-detected)
export DATABASE_URL="mysql://user:pass@localhost:3306/dbname"
bunx bun-sql-studio

# Or create bun-sql-studio.json
echo '{"dialect": "mysql", "dbUrl": "mysql://user:pass@localhost:3306/dbname"}' > bun-sql-studio.json
bunx bun-sql-studio
```

The studio starts at `http://localhost:4987` for all database types.

### Configuration

The studio automatically detects your database settings from:

- **Drizzle config** (`drizzle.config.ts` or `drizzle.config.js`) - zero-config for existing projects
- **Studio config** (`bun-sql-studio.json`) - create this for manual configuration

```json
{
	"dialect": "sqlite", // or "postgresql" or "mysql"
	"dbUrl": "./database.sqlite", // or connection string
	"port": 4987
}
```

## Features

- **Multi-Database Support**: SQLite, PostgreSQL, and MySQL
- **Zero-Config Setup**: Auto-detects Drizzle config for instant database connection
- **Professional Table Browser**: View all tables with column information and data types
- **Advanced Query Editor**: Execute SQL queries with syntax highlighting and results table
- **JSON Data Viewer**: Inspect JSON columns with expandable modal interface
- **Row Selection**: Select individual rows or bulk operations with checkboxes
- **Column Resizing**: Drag to resize table columns with smooth performance
- **Smart Pagination**: Navigate large datasets with configurable page sizes
- **Responsive Design**: Professional UI that works on desktop and mobile

## Supported Databases

| Database | Status | Features |
|----------|--------|----------|
| SQLite | ✅ Full | Tables, columns, queries, local .db files |
| PostgreSQL | ✅ Full | information_schema, full SQL, production databases |
| MySQL | ✅ Full | SHOW TABLES, DESCRIBE, full SQL, enterprise databases |

## Configuration

| Option    | Type   | Default  | Description |
| --------- | ------ | -------- | ----------- |
| `dialect` | string | "sqlite" | Database type: "sqlite", "postgresql", or "mysql" |
| `dbUrl`   | string | required | Database connection: file path for SQLite, connection string for others |
| `port`    | number | 4987     | Server port |

### Database Connection Examples

**SQLite:**
```json
{
  "dialect": "sqlite",
  "dbUrl": "./database.sqlite"
}
```

**PostgreSQL:**
```json
{
  "dialect": "postgresql",
  "dbUrl": "postgresql://user:password@localhost:5432/database"
}
```

**MySQL:**
```json
{
  "dialect": "mysql",
  "dbUrl": "mysql://user:password@localhost:3306/database"
}
```

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
