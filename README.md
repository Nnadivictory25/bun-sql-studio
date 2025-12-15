# Bun SQL Studio

A modern SQL database interface specifically built for Bun runtime. Browse SQLite tables, run queries, and inspect JSON data using Bun's native SQLite (for now).

## Installation

```bash
bun install -g bun-sql-studio
# Requires Bun runtime for optimal performance
```

## Quick Start

1. Create `bun-sql-studio.json` in your project directory:

```json
{
	"dialect": "sqlite",
	"dbUrl": "./database.sqlite",
	"port": 4987
}
```

2. Run the studio:

```bash
bun-sql-studio
# Uses Bun runtime for fast startup and SQLite operations
```

3. Open `http://localhost:4987` in your browser.

## Features

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

## Usage

### Table Browsing

- Click table names in the sidebar
- View column types and nullability
- Browse data with pagination

### Running Queries

- Use the query interface (coming in v0.2.0)
- Execute read-only SELECT statements
- View results in sortable table

### JSON Data

- JSON columns display truncated preview
- Click "See More" for full JSON in modal
- Copy formatted JSON to clipboard

## Requirements

- Bun runtime (required for execution and SQLite support)
- SQLite database file
- Node.js 18+ (for NPM installation, or use Bun's package manager)

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
