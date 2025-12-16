import { SQL } from "bun";
import type { DatabaseAdapter, ColumnInfo, TableInfo, QueryResult } from "./index";

export class MySQLAdapter implements DatabaseAdapter {
  private db: SQL;

  constructor(dbUrl: string) {
    this.db = new SQL(dbUrl);
  }

  async getTables(): Promise<TableInfo[]> {
    const result = await this.db`SHOW TABLES`;
    return result.map((row: any) => ({ name: Object.values(row)[0] as string }));
  }

  async getColumns(tableName: string): Promise<ColumnInfo[]> {
    const result = await this.db`DESCRIBE ${tableName}`;
    return result.map((col: any) => ({
      name: col.Field,
      type: col.Type,
      nullable: col.Null === 'YES'
    }));
  }

  async executeQuery(sql: string): Promise<QueryResult> {
    const rows = await this.db.unsafe(sql);
    return { rows };
  }

  async getTotalRows(tableName: string): Promise<number> {
    const result = await this.db.unsafe(`SELECT COUNT(*) as count FROM ${tableName}`);
    return result[0].count;
  }

  async getDatabaseName(): Promise<string> {
    const result = await this.db.unsafe("SELECT DATABASE()");
    return result[0].DATABASE() || 'unknown';
  }
}