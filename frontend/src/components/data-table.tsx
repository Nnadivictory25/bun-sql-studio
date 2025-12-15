import React, { useState } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	type ColumnDef,
} from '@tanstack/react-table';

type Row = Record<string, unknown>;

interface PaginationControlsProps {
	table: any;
	totalRows?: number;
	limit: number;
}

const PaginationControls = ({
	table,
	totalRows,
	limit,
}: PaginationControlsProps) => {
	const { pageIndex } = table.getState().pagination;
	// Calculate page count:
	// If we have manual totalRows, use it.
	// Otherwise use table.getPageCount() for client-side pagination
	const pageCount = totalRows
		? Math.ceil(totalRows / limit)
		: table.getPageCount();

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

interface DataTableProps {
	data: Row[];
	columns?: ColumnDef<Row>[];
	totalRows?: number; // If provided, enables manual pagination UI logic
	limit?: number;
	isLoading?: boolean;
	headerSlot?: React.ReactNode;
	onPaginationChange?: (updater: any) => void;
	pagination?: { pageIndex: number; pageSize: number };
}

export const DataTable = ({
	data,
	columns: customColumns,
	totalRows,
	limit = 100,
	isLoading,
	headerSlot,
	onPaginationChange,
	pagination,
}: DataTableProps) => {
	const [jsonModalData, setJsonModalData] = useState<unknown | null>(null);

	const showJsonModal = (data: unknown) => {
		setJsonModalData(data);
		(document.getElementById('json_modal') as HTMLDialogElement)?.showModal();
	};

	// Custom cell for JSON columns
	const JsonCell = ({
		value,
		onShowModal,
		onShowPopover,
	}: {
		value: any;
		onShowModal: (data: any) => void;
		onShowPopover: (e: React.MouseEvent, content: string) => void;
	}) => {
		if (!value) return null;

		let parsed = value;
		if (typeof value === 'string') {
			try {
				parsed = JSON.parse(value);
			} catch {
				// Failed parsing, treat as long text
				const maxLength = 28;
				if (value.length <= maxLength)
					return (
						<span className='truncate' title={value}>
							{value}
						</span>
					);
				return (
					<div className='flex items-center gap-2'>
						<span className='truncate' title={value}>
							{value.substring(0, maxLength)}...
						</span>
						<button
							className='btn btn-xs btn-ghost text-primary no-animation h-auto min-h-0 py-1'
							onClick={(e) => onShowPopover(e, value)}>
							View
						</button>
					</div>
				);
			}
		}

		// If it's an object (or successfully parsed), show button
		if (typeof parsed === 'object' && parsed !== null) {
			return (
				<button
					className='btn btn-xs btn-outline btn-info'
					onClick={() => onShowModal(parsed)}>
					View JSON
				</button>
			);
		}

		return (
			<span className='truncate' title={String(value)}>
				{String(value)}
			</span>
		);
	};

	// Custom cell for long text
	const TextCell = ({
		value,
		onShowPopover,
	}: {
		value: string;
		onShowPopover: (e: React.MouseEvent, content: string) => void;
	}) => {
		const maxLength = 28;
		if (value.length <= maxLength)
			return (
				<span className='truncate' title={value}>
					{value}
				</span>
			);

		return (
			<div className='flex items-center gap-2'>
				<span className='truncate' title={value}>
					{value.substring(0, maxLength)}...
				</span>
				<button
					className='btn btn-xs btn-ghost text-primary no-animation h-auto min-h-0 py-1'
					onClick={(e) => onShowPopover(e, value)}>
					View
				</button>
			</div>
		);
	};

	// Popover State
	const [activePopover, setActivePopover] = useState<{
		content: string;
		rect: DOMRect;
	} | null>(null);

	const handleShowPopover = (e: React.MouseEvent, content: string) => {
		// e.stopPropagation(); // Prevents row click if any
		const rect = e.currentTarget.getBoundingClientRect();
		setActivePopover({ content, rect });
	};

	// Default column definition handles cell rendering
	const defaultColumn: Partial<ColumnDef<Row>> = {
		cell: (info) => {
			const value = info.getValue() as unknown;
			const meta = info.column.columnDef.meta as any;

			// Heuristic to detect stringified JSON (starts with { or [)
			const isLikeJson =
				typeof value === 'string' &&
				(value.trim().startsWith('{') || value.trim().startsWith('['));

			// Handle JSON/Objects
			if (
				meta?.isJson ||
				(typeof value === 'object' && value !== null) ||
				isLikeJson
			) {
				return (
					<JsonCell
						value={value}
						onShowModal={showJsonModal}
						onShowPopover={handleShowPopover}
					/>
				);
			}

			// Handle Long Text
			if (typeof value === 'string' && value.length > 28) {
				return <TextCell value={value} onShowPopover={handleShowPopover} />;
			}

			return (
				<span className='truncate' title={String(value)}>
					{String(value)}
				</span>
			);
		},
	};

	// Auto-generated columns if not provided
	const columns = React.useMemo<ColumnDef<Row>[]>(() => {
		if (customColumns) return customColumns;
		if (!data || data.length === 0) return [];

		// For QueryResults, we infer columns from data
		// We look at the first row (or schema if available, but here simplest is first row)
		// Wait, QueryResults provided generated columns logic based on first row.
		// We should replicate that here.
		const firstRow = data[0];
		if (!firstRow) return [];

		return Object.keys(firstRow).map((key) => ({
			accessorKey: key,
			header: key,
			size: 100,
			minSize: 50,
			maxSize: 500,
			// cell is handled by defaultColumn
		}));
	}, [customColumns, data]);

	const table = useReactTable({
		data: data ?? [],
		columns,
		defaultColumn,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
		manualPagination: !!onPaginationChange, // Enable manual if handler provided
		pageCount: totalRows ? Math.ceil(totalRows / limit) : undefined,
		onPaginationChange: onPaginationChange,
		state: pagination ? { pagination } : undefined, // Controlled state
		initialState:
			!pagination && !onPaginationChange
				? {
						pagination: { pageSize: limit },
					}
				: undefined,
	});

	if (isLoading) return <div className='skeleton h-64 w-full'></div>;

	return (
		<div className='border border-base-300 rounded-lg overflow-hidden flex flex-col h-full bg-base-100 relative'>
			{/* Table Details / Header */}
			<div className='p-4 bg-base-200 border-b border-base-300 flex justify-between items-center shrink-0'>
				<span className='text-sm'>
					Showing {table.getState().pagination.pageIndex * limit + 1}-
					{Math.min(
						(table.getState().pagination.pageIndex + 1) * limit,
						totalRows || data.length || 0
					)}{' '}
					of {totalRows || data.length || 0} rows
				</span>

				{headerSlot && <div>{headerSlot}</div>}
			</div>

			<div className='flex-1 overflow-auto'>
				<table className='table table-zebra table-sm w-full table-fixed'>
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
										className='border-r border-base-300 px-3 py-1 text-sm truncate'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			<div className='flex justify-center items-center p-4 bg-base-200 border-t border-base-300 shrink-0'>
				<PaginationControls table={table} totalRows={totalRows} limit={limit} />
			</div>

			{/* Custom Popover for Text Preview */}
			{activePopover && (
				<>
					{/* Backdrop to close */}
					<div
						className='fixed inset-0 z-40 bg-transparent'
						onClick={() => setActivePopover(null)}
					/>
					{/* The Popover */}
					<div
						className='fixed z-50 bg-base-100 shadow-xl border border-base-300 rounded p-2 text-sm max-w-md overflow-auto max-h-80'
						style={{
							top: activePopover.rect.bottom + 5,
							left: Math.min(activePopover.rect.left, window.innerWidth - 320),
						}}>
						<pre className='whitespace-pre-wrap break-words font-mono text-xs bg-base-200 p-2 rounded'>
							{activePopover.content}
						</pre>
					</div>
				</>
			)}

			{/* JSON MODAL */}
			<dialog id='json_modal' className='modal'>
				<div className='modal-box max-w-4xl'>
					<h3 className='font-bold text-lg'>JSON Data</h3>
					<div className='py-4'>
						<pre className='bg-base-200 p-4 rounded text-sm overflow-auto max-h-96'>
							{jsonModalData ? JSON.stringify(jsonModalData, null, 2) : ''}
						</pre>
					</div>
					<div className='modal-action'>
						<button
							className='btn btn-outline'
							onClick={() =>
								navigator.clipboard.writeText(
									JSON.stringify(jsonModalData, null, 2)
								)
							}>
							Copy
						</button>
						<form method='dialog'>
							<button className='btn'>Close</button>
						</form>
					</div>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
};
