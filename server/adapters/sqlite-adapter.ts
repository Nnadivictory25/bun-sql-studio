import { SQL } from "bun";
import type { DatabaseAdapter, ColumnInfo, TableInfo, QueryResult } from "./index";

export class SQLiteAdapter implements DatabaseAdapter {
  private db: SQL;
  private dbUrl: string;

  constructor(dbUrl: string) {
    this.dbUrl = dbUrl;
    this.db = new SQL(dbUrl, { adapter: "sqlite" });
  }

  async getTables(): Promise<TableInfo[]> {
    const result = await this.db`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`;
    return result.map((row: any) => ({ name: row.name }));
  }

  async getColumns(tableName: string): Promise<ColumnInfo[]> {
    const result = await this.db.unsafe(`PRAGMA table_info(${tableName})`);
    return result.map((col: any) => ({
      name: col.name,
      type: col.type,
      nullable: col.notnull === 0
    }));
  }

  async executeQuery(sql: string): Promise<QueryResult> {
    const rows = await this.db.unsafe(`${sql}`);
    return { rows };
  }

  async getTotalRows(tableName: string): Promise<number> {
    const result = await this.db.unsafe(`SELECT COUNT(*) as count FROM ${tableName}`);
    return result[0].count;
  }

  async getDatabaseName(): Promise<string> {
    // Extract database name from file path (supports .sqlite and .db extensions)
    const match = this.dbUrl.match(/([^/\\]+)\.(sqlite|db)$/);
    return match?.[1] || 'unknown';
  }
}