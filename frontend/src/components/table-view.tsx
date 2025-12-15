import React, { useState } from 'react';
import { Database } from 'lucide-react';
import { useStore } from '@tanstack/react-store';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { store } from '../lib/store';
import { tableDataQueryOptions } from '../lib/query-options';
import { DataTable } from './data-table';

type Row = Record<string, unknown>;

export function TableView() {
	const currentTable = useStore(store, (s) => s.currentTable);
	const [offset, setOffset] = useState(0);
	const limit = 100;

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
			size: 100,
			minSize: 50,
			maxSize: 500,
			meta: {
				isJson: col.type.toLowerCase().includes('json'),
			},
		}));
	}, [data?.columns]);

	const handlePaginationChange = (updater: any) => {
		// updater can be a function or value
		// We need current pagination state to pass to function if needed?
		// But DataTable manages state internally or via props?
		// For Manual pagination, DataTable uses usage of `onPaginationChange` to allow manual control.
		// But the state is usually managed by the table instance inside DataTable.
		// To control it from parent, we need to pass `pagination` prop.
		// Let's compute local pagination state from `offset`.
		const pageIndex = Math.floor(offset / limit);

		// Helper to resolve updater
		const nextState =
			typeof updater === 'function'
				? updater({ pageIndex, pageSize: limit })
				: updater;

		setOffset(nextState.pageIndex * limit);
	};

	if (!currentTable) {
		return <div className='p-4'>Select a table from the sidebar</div>;
	}

	if (isLoading) return <div className='skeleton h-64 w-full'></div>;
	if (error)
		return <div className='alert alert-error'>{(error as Error).message}</div>;

	return (
		<DataTable
			data={(data?.rows ?? []) as Row[]}
			columns={columns}
			totalRows={data?.totalRows}
			limit={limit}
			onPaginationChange={handlePaginationChange}
			pagination={{ pageIndex: Math.floor(offset / limit), pageSize: limit }}
			headerSlot={
				<label
					htmlFor='sql-studio-drawer'
					className='btn btn-primary btn-sm gap-2 drawer-button'>
					<Database className='size-4' />
					SQL Query Studio
				</label>
			}
		/>
	);
}
