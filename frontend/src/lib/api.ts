const IS_DEV = import.meta.env.DEV;
const ENDPOINT = IS_DEV ? "http://localhost:4987" : "https://api.example.com"; //TODO: Change to actual endpoint

export const api = {
  getTables: (): Promise<TablesResponse> =>
    fetch(`${ENDPOINT}/tables`).then(res => res.json()),

  getTableData: ({
    table,
    limit,
    offset
  }: {
    table: string;
    limit: number;
    offset: number;
  }): Promise<TableDataResponse> =>
    fetch(`${ENDPOINT}/table-data?table=${table}&limit=${limit}&offset=${offset}`)
      .then(res => res.json()),

  runQuery: (sql: string): Promise<QueryResponse> =>
    fetch(`${ENDPOINT}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql })
    }).then(res => res.json()),
};