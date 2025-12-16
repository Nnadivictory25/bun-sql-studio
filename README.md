# Bun SQL Studio v1.0 🎉

**A modern, zero-config SQL database IDE for Bun**

Bun SQL Studio is a fast, professional database interface for **SQLite, PostgreSQL, and MySQL**. It lets you browse tables, run queries, and inspect data with minimal setup—designed for developers who want tooling that _just works_.

---

## Why Bun SQL Studio?

Most database tools fall into two extremes:

- **Heavy GUI apps** that are slow, bloated, and painful to install
- **CLI-based tools** that are powerful but hard to navigate and visualize

On top of that, many “simple” database UIs quietly depend on **extra system binaries**.

### The problems Bun SQL Studio solves

- **CLI fatigue** – remembering commands, flags, and parsing raw output
- **Poor data visualization** – tables, relations, and JSON are hard to inspect
- **Hidden dependencies** – tools that require Python, Java, system SQLite, or native DB clients
- **Context switching** – bouncing between terminal, editor, and browser

---

## What makes Bun SQL Studio different

- **Single runtime** – requires only **Bun**
- **No extra binaries** – no Python, Java, `sqlite3`, `psql`, or `mysql` clients
- **Visual-first UI** – inspect tables, JSON, and query results with ease
- **Instant setup** – auto-detects Drizzle configs or uses a single config file
- **Consistent experience** – same workflow for SQLite, PostgreSQL, and MySQL

If Bun runs, **Bun SQL Studio runs**.

---

## Quick Start

Bun SQL Studio uses **one configuration file** for all databases.

Create `bun-sql-studio.json` in your project root and define **either** a SQLite file path **or** a database connection string.

```bash
bunx bun-sql-studio
```

The studio starts at:

```
http://localhost:4987
```

---

## Configuration

### `bun-sql-studio.json`

```json
{
	"dialect": "sqlite",
	"dbUrl": "./database.sqlite",
	"port": 4987
}
```

- Use a **file path** for SQLite
- Use a **connection string** for PostgreSQL or MySQL
- If a **Drizzle config** is present, it will be auto-detected and used instead

---

### Database examples

**SQLite**

```json
{
	"dialect": "sqlite",
	"dbUrl": "./database.sqlite"
}
```

**PostgreSQL**

```json
{
	"dialect": "postgresql",
	"dbUrl": "postgresql://user:password@localhost:5432/database"
}
```

**MySQL**

```json
{
	"dialect": "mysql",
	"dbUrl": "mysql://user:password@localhost:3306/database"
}
```

---

## Features

- **Visual Table Browser** – Explore tables and columns without writing SQL
- **SQL Query Editor** – Execute queries with readable, paginated results
- **JSON Viewer** – Inspect nested JSON in a clean modal UI
- **Column Resizing** – Smooth drag-to-resize interactions
- **Pagination** – Efficient browsing of large datasets
- **Cross-Database Support** – One UI for all supported databases

---

## Supported Databases

| Database   | Status  | Notes                               |
| ---------- | ------- | ----------------------------------- |
| SQLite     | ✅ Full | No system SQLite or Python required |
| PostgreSQL | ✅ Full | No `psql` binary needed             |
| MySQL      | ✅ Full | No `mysql` client required          |

---

## Configuration Options

| Option    | Type   | Default | Description                              |
| --------- | ------ | ------- | ---------------------------------------- |
| `dialect` | string | sqlite  | `sqlite`, `postgresql`, or `mysql`       |
| `dbUrl`   | string | —       | SQLite file path or DB connection string |
| `port`    | number | 4987    | Server port                              |

---

## Requirements

- **Bun** (nothing else)

---

## Troubleshooting

**Studio doesn’t start**

- Ensure `bun-sql-studio.json` exists and contains valid JSON
- Confirm the database path or connection string is correct

**Database connection errors**

- Check credentials and permissions
- Ensure SQLite files exist and are readable

**Port already in use**

- Change the `port` value in the config file

---

## License

MIT
