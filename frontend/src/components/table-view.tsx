import React, { useState } from 'react';
import { useStore } from '@tanstack/react-store';
import { useQuery } from '@tanstack/react-query';
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	type ColumnDef,
} from '@tanstack/react-table';
import { store } from '../lib/store';
import { tableDataQueryOptions } from '../lib/query-options';

type Row = Record<string, unknown>;

// Helper to truncate JSON string
const truncateJson = (jsonString: string, maxLength: number = 100) => {
	if (jsonString.length <= maxLength) return jsonString;
	return jsonString.substring(0, maxLength) + '...';
};

const PaginationControls = ({
	table,
	totalRows,
	limit,
}: {
	table: any;
	totalRows?: number;
	limit: number;
}) => {
	const { pageIndex } = table.getState().pagination;
	const pageCount = Math.ceil((totalRows || 0) / limit);

	if (!totalRows) return null;

	return (
		<div className='flex gap-2'>
			<button
				className='btn btn-sm'
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}>
				Previous
			</button>

			<span className='flex items-center px-3 text-sm'>
				Page {pageIndex + 1} of {pageCount}
			</span>

			<button
				className='btn btn-sm'
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}>
				Next
			</button>
		</div>
	);
};

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

	const [jsonModalData, setJsonModalData] = useState<unknown | null>(null);

	const showJsonModal = (data: unknown) => {
		setJsonModalData(data);
		(document.getElementById('json_modal') as HTMLDialogElement)?.showModal();
	};

// Custom cell for JSON columns
const JsonCell = ({ getValue, onShowModal }: { getValue: any; onShowModal: (data: any) => void }) => {
  const value = getValue();

  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    return (
      <button
        className="btn btn-xs btn-outline btn-info"
        onClick={() => onShowModal(parsed)}
      >
        View JSON
      </button>
    );
  } catch {
    // If not valid JSON, display as string
    return <span className="truncate">{truncateJson(value)}</span>;
  }
};

	const columns = React.useMemo<ColumnDef<Row>[]>(() => {
		if (!data?.columns) return [];

		return data.columns.map((col) => ({
			accessorKey: col.name,
			header: col.name,
			size: 100,
			minSize: 50,
			maxSize: 500,
			cell: col.type.toLowerCase().includes('json')
				? (info) => <JsonCell getValue={info.getValue} onShowModal={showJsonModal} />
				: (info) => <span>{String(info.getValue())}</span>,
		}));
	}, [data?.columns]);

	const table = useReactTable({
		data: (data?.rows ?? []) as Row[],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
		manualPagination: true,
		pageCount: Math.ceil((data?.totalRows || 0) / limit),
		onPaginationChange: (updater) => {
			const newPagination =
				typeof updater === 'function'
					? updater(table.getState().pagination)
					: updater;
			setOffset(newPagination.pageIndex * limit);
		},
	});

	if (!currentTable) {
		return <div className='p-4'>Select a table from the sidebar</div>;
	}

	if (isLoading) return <div className='skeleton h-64 w-full'></div>;
	if (error)
		return <div className='alert alert-error'>{(error as Error).message}</div>;

	return (
		<div className='border border-base-300 rounded-lg overflow-hidden'>
			{/* Table Details */}
			<div className='p-4 bg-base-200 border-b border-base-300'>
				<span className='text-sm'>
					Showing {table.getState().pagination.pageIndex * limit + 1}-
					{Math.min(
						(table.getState().pagination.pageIndex + 1) * limit,
						data?.totalRows || 0
					)}{' '}
					of {data?.totalRows || 0} rows
				</span>
			</div>

			<div className='overflow-auto max-h-[60vh]'>
				<table className='table table-zebra table-fixed w-full'>
					<thead className='sticky top-0 z-10 bg-base-200'>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{hg.headers.map((header) => (
									<th
										key={header.id}
										style={{ width: header.getSize() }}
										className='relative px-3 py-2 text-sm font-semibold border-r border-base-300'>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}

										{/* Resize handle */}
										<div
											onMouseDown={header.getResizeHandler()}
											className='absolute right-0 top-0 h-full w-[4px] cursor-col-resize hover:bg-primary'
										/>
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className='hover'>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className='border-r border-base-300 px-3 py-1 text-sm'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			<div className='flex justify-center items-center p-4 bg-base-200 border-t border-base-300'>
				<PaginationControls
					table={table}
					totalRows={data?.totalRows}
					limit={limit}
				/>
			</div>

			{/* JSON MODAL */}
			<dialog id="json_modal" className="modal">
				<div className="modal-box max-w-4xl">
					<h3 className="font-bold text-lg">JSON Data</h3>
					<div className="py-4">
						<pre className="bg-base-200 p-4 rounded text-sm overflow-auto max-h-96">
							{jsonModalData ? JSON.stringify(jsonModalData, null, 2) : ''}
						</pre>
					</div>
					<div className="modal-action">
						<button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(jsonModalData, null, 2))}>
							Copy
						</button>
						<form method="dialog">
							<button className="btn">Close</button>
						</form>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}


