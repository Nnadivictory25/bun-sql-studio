import { api } from "./api";
import { queryOptions, keepPreviousData } from "@tanstack/react-query";

type TableDataQueryOptions = {
    table: string;
    limit?: number;
    offset?: number;
}

export const tablesQueryOptions = queryOptions({
    queryKey: ['tables'],
    queryFn: () => api.getTables(),
})

export const schemaQueryOptions = queryOptions({
    queryKey: ['schema'],
    queryFn: () => api.getSchema(),
})

export const tableDataQueryOptions = ({
    table,
    limit = 50,
    offset = 0,
}: TableDataQueryOptions) => queryOptions({
    queryKey: ['tableData', table, limit, offset],
    queryFn: () => api.getTableData({ table, limit, offset }),
    staleTime: 5 * 60 * 1000, // 5 minutes - keep data fresh longer
    refetchOnMount: false, // Don't refetch if we already have cached data
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    // Keep showing previous data while new data loads - enables blur overlay
    placeholderData: keepPreviousData,
})

export const queryQueryOptions = (sql: string) => queryOptions({
    queryKey: ['query', sql],
    queryFn: () => api.runQuery(sql),
})

export const metaQueryOptions = queryOptions({
    queryKey: ['meta'],
    queryFn: () => api.getMeta(),
    staleTime: 30 * 60 * 1000, // 30 minutes - metadata rarely changes
})