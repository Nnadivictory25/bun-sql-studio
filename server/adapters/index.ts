import { SQL } from "bun";
import { SQLiteAdapter } from './sqlite-adapter';
import { PostgresAdapter } from './postgres-adapter';
import { MySQLAdapter } from './mysql-adapter';

export type DatabaseDialect = 'sqlite' | 'postgresql' | 'mysql';

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
}

export interface TableInfo {
  name: string;
}

export interface QueryResult {
  rows: Record<string, any>[];
}

export interface DatabaseAdapter {
  getTables(): Promise<TableInfo[]>;
  getColumns(tableName: string): Promise<ColumnInfo[]>;
  executeQuery(sql: string): Promise<QueryResult>;
  getTotalRows(tableName: string): Promise<number>;
  getDatabaseName(): Promise<string>;
}

export function createAdapter({ dbUrl, dialect }: { dbUrl: string; dialect: DatabaseDialect }): DatabaseAdapter {
  if (!dialect) {
    throw new Error('Database dialect must be specified. Supported: sqlite, postgresql, mysql');
  }

  if (dialect === 'sqlite') {
    return new SQLiteAdapter(dbUrl);
  }

  if (dialect === 'postgresql') {
    return new PostgresAdapter(dbUrl);
  }

  if (dialect === 'mysql') {
    return new MySQLAdapter(dbUrl);
  }

  throw new Error(`Unsupported database dialect: ${dialect}. Supported: sqlite, postgresql, mysql`);
}