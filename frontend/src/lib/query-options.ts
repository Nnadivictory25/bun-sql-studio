import { api } from "./api";
import { queryOptions } from "@tanstack/react-query";

type TableDataQueryOptions = {
    table: string;
    limit?: number;
    offset?: number;
}

export const tablesQueryOptions = queryOptions({
    queryKey: ['tables'],
    queryFn: () => api.getTables(),
})

export const tableDataQueryOptions = ({
    table,
    limit = 100,
    offset = 0,
}: TableDataQueryOptions) => queryOptions({
    queryKey: ['tableData', table],
    queryFn: () => api.getTableData({ table, limit, offset }),
})

export const queryQueryOptions = (sql: string) => queryOptions({
    queryKey: ['query', sql],
    queryFn: () => api.runQuery(sql),
})