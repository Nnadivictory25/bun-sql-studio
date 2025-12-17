import React, { useState, useDeferredValue } from 'react';
import { useStore } from '@tanstack/react-store';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { store } from '../lib/store';
import { tableDataQueryOptions } from '../lib/query-options';
import { DataTable } from './data-table';

type Row = Record<string, unknown>;

export function TableView() {
	const currentTable = useStore(store, (s) => s.currentTable);

	// Defer table changes - lets sidebar update instantly while table catches up
	const deferredTable = useDeferredValue(currentTable);

	// State for pagination: limit (pageSize) and offset
	const [paginationState, setPaginationState] = useState({
		pageIndex: 0,
		pageSize: 50,
	});

	const offset = paginationState.pageIndex * paginationState.pageSize;
	const limit = paginationState.pageSize;

	// Reset pagination when table changes - proper React approach
	// Using a key-based component would be cleaner, but for now we'll use this approach
	const shouldResetPagination = React.useRef(false);
	React.useLayoutEffect(() => {
		if (shouldResetPagination.current) {
			setPaginationState((prev) => ({ ...prev, pageIndex: 0 }));
		}
		shouldResetPagination.current = true;
	}, [currentTable]);

	// Use DEFERRED table for query - sidebar updates instantly, table follows
	const { data, isLoading, isFetching, error } = useQuery(
		tableDataQueryOptions({
			table: deferredTable!,
			limit,
			offset,
		})
	);

	// Show blur when:
	// 1. Table is switching (currentTable !== deferredTable)
	// 2. OR fetching new page data
	const isTableSwitching = currentTable !== deferredTable;
	const showTableBlur = isTableSwitching || (isFetching && !isLoading);

	const columns = React.useMemo<ColumnDef<Row>[]>(() => {
		const rawColumns = data?.columns ?? [];
		return rawColumns.map((col) => ({
			accessorKey: col.name,
			header: col.name,
			size: 150,
			minSize: 50,
			maxSize: 500,
			meta: {
				isJson: col.type.toLowerCase().includes('json'),
			},
		}));
	}, [data?.columns]);

	if (!currentTable) {
		return (
			<div className='p-4 text-slate-400'>Select a table from the sidebar</div>
		);
	}

	// Only show full loading screen when there's NO data at all (first ever load)
	if (isLoading && !data)
		return (
			<div className='h-full flex flex-col items-center justify-center p-8 space-y-4'>
				<span className='loading loading-spinner loading-lg text-indigo-400'></span>
				<div className='text-center'>
					<p className='text-slate-300 font-medium'>Loading table data...</p>
					<p className='text-slate-500 text-sm'>
						Fetching {currentTable} records
					</p>
				</div>
			</div>
		);

	if (error)
		return (
			<div className='p-4 text-red-400'>Error: {(error as Error).message}</div>
		);

	return (
		<DataTable
			key={deferredTable}
			data={(data?.rows ?? []) as Row[]}
			columns={columns}
			totalRows={data?.totalRows}
			limit={paginationState.pageSize}
			pagination={paginationState}
			onPaginationChange={setPaginationState}
			isFetching={showTableBlur}
		/>
	);
}
