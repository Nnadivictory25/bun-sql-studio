const IS_DEV = import.meta.env.DEV;
const ENDPOINT = IS_DEV ? "http://localhost:4987" : ""; // Relative URLs for production

export const api = {
  getTables: (): Promise<TablesResponse> =>
    fetch(`${ENDPOINT}/tables`).then(res => res.json()),

  getSchema: (): Promise<SchemaResponse> =>
    fetch(`${ENDPOINT}/schema`).then(res => res.json()),

  getMeta: (): Promise<{ dialect: string; databaseName: string }> =>
    fetch(`${ENDPOINT}/meta`).then(res => res.json()),

  getTableData: async ({
    table,
    limit,
    offset
  }: {
    table: string;
    limit: number;
    offset: number;
  }): Promise<TableDataResponse> => {
    const res = await fetch(`${ENDPOINT}/table-data?table=${table}&limit=${limit}&offset=${offset}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch table data');
    }
    return data;
  },

  runQuery: async (sql: string): Promise<QueryResponse> => {
    const res = await fetch(`${ENDPOINT}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to run query');
    }
    return data;
  },
};