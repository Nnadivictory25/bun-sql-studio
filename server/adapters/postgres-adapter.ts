import { SQL } from "bun";
import type { DatabaseAdapter, ColumnInfo, TableInfo, QueryResult } from "./index";

export class PostgresAdapter implements DatabaseAdapter {
  private db: SQL;

  constructor(dbUrl: string) {
    this.db = new SQL(dbUrl);
  }

  async getTables(): Promise<TableInfo[]> {
    const result = await this.db`SELECT table_name as name FROM information_schema.tables WHERE table_schema = 'public'`;
    return result;
  }

  async getColumns(tableName: string): Promise<ColumnInfo[]> {
    const result = await this.db`SELECT
      column_name as name,
      data_type as type,
      CASE WHEN is_nullable = 'YES' THEN true ELSE false END as nullable
      FROM information_schema.columns
      WHERE table_name = ${tableName} AND table_schema = 'public'
      ORDER BY ordinal_position`;

    return result.map((col: any) => ({
      name: col.name,
      type: col.type,
      nullable: col.nullable
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
    const result = await this.db.unsafe("SELECT current_database()");
    return result[0].current_database || 'unknown';
  }
}