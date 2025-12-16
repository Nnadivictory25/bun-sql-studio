import React, { useState } from 'react';
import { useStore } from '@tanstack/react-store';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { store } from '../lib/store';
import { tableDataQueryOptions } from '../lib/query-options';
import { DataTable } from './data-table';

type Row = Record<string, unknown>;

export function TableView() {
	const currentTable = useStore(store, (s) => s.currentTable);
	// State for pagination: limit (pageSize) and offset
	const [paginationState, setPaginationState] = useState({
		pageIndex: 0,
		pageSize: 100, // Default limit
	});

	const offset = paginationState.pageIndex * paginationState.pageSize;
	const limit = paginationState.pageSize;

	const { data, isLoading, error } = useQuery(
		tableDataQueryOptions({
			table: currentTable!,
			limit,
			offset,
		})
	);

	const columns = React.useMemo<ColumnDef<Row>[]>(() => {
		if (!data?.columns) return [];

		return data.columns.map((col) => ({
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

	const handlePaginationChange = (updater: any) => {
		setPaginationState((old) => {
			const nextState = typeof updater === 'function' ? updater(old) : updater;
			return nextState;
		});
	};

	if (!currentTable) {
		return (
			<div className='p-4 text-slate-400'>Select a table from the sidebar</div>
		);
	}

	if (isLoading)
		return (
			<div className='h-full flex items-center justify-center text-slate-500'>
				Loading...
			</div>
		);
	if (error)
		return (
			<div className='p-4 text-red-400'>Error: {(error as Error).message}</div>
		);

	return (
		<DataTable
			data={(data?.rows ?? []) as Row[]}
			columns={columns}
			totalRows={data?.totalRows}
			limit={limit}
			onPaginationChange={handlePaginationChange}
			pagination={paginationState}
		/>
	);
}
