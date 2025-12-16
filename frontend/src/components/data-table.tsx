import React, { useState, useCallback } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	type ColumnDef,
} from '@tanstack/react-table';
import {
	FileJson,
	ChevronLeft,
	ChevronRight,
	MoreHorizontal,
	ArrowUpDown,
	ChevronsLeft,
	ChevronsRight,
	X,
	Maximize2,
} from 'lucide-react';
import JsonViewer from './json-viewer';

type Row = Record<string, unknown>;

// Props for CellFormatter - moved outside component
interface CellFormatterProps {
	value: unknown;
	onShowJson: (content: unknown, title?: string) => void;
}

// TruncatedCell - simplified: no DOM detection, show expand on cell hover
const TruncatedCell = React.memo(({ text }: { text: string }) => {
	const [showPopover, setShowPopover] = useState(false);
	const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

	const handleShowPopover = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		setPopoverPosition({
			top: rect.bottom + 4,
			left: Math.max(8, Math.min(rect.left, window.innerWidth - 320)),
		});
		setShowPopover(true);
	}, []);

	const handleClosePopover = useCallback(() => setShowPopover(false), []);

	return (
		<>
			{/* Use named group/cell to avoid conflict with row's group class */}
			<div className='flex items-center justify-between w-full group/cell relative min-w-0'>
				<span
					className='truncate min-w-0 flex-1 block text-slate-300 cursor-default'
					title={text}>
					{text}
				</span>
				{/* Only visible when hovering THIS cell specifically */}
				<button
					onClick={handleShowPopover}
					className='shrink-0 ml-1 p-0.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded cursor-pointer opacity-0 group-hover/cell:opacity-100 transition-opacity'>
					<Maximize2 size={10} />
				</button>
			</div>

			{/* Popover */}
			{showPopover && (
				<>
					{/* Backdrop */}
					<div className='fixed inset-0 z-40' onClick={handleClosePopover} />
					{/* Popover Content */}
					<div
						className='fixed z-50 bg-slate-900 border border-slate-700 shadow-xl rounded-md p-3 overflow-auto text-sm text-slate-300 whitespace-pre-wrap font-sans custom-scrollbar max-w-xs sm:max-w-md'
						style={{
							top: popoverPosition.top,
							left: popoverPosition.left,
							maxHeight: '300px',
						}}>
						{text}
					</div>
				</>
			)}
		</>
	);
});

// CellFormatter moved OUTSIDE the component - critical for performance
// This prevents React from treating it as a new component on every parent render
const CellFormatter = React.memo(
	({ value, onShowJson }: CellFormatterProps) => {
		if (value === null || value === undefined) {
			return <span className='text-slate-600 italic text-xs'>NULL</span>;
		}

		if (typeof value === 'boolean') {
			return (
				<span
					className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${value ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
					{value ? 'TRUE' : 'FALSE'}
				</span>
			);
		}

		// JSON Object detection
		if (typeof value === 'object') {
			return (
				<button
					onClick={() => onShowJson(value, 'JSON Data')}
					className='flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded transition-colors cursor-pointer'>
					<FileJson size={12} />
					<span>JSON</span>
				</button>
			);
		}

		const strValue = String(value);

		// Heuristic to detect stringified JSON
		const trimmed = strValue.trim();
		const isJsonLike =
			trimmed.length > 0 &&
			((trimmed[0] === '{' && trimmed[trimmed.length - 1] === '}') ||
				(trimmed[0] === '[' && trimmed[trimmed.length - 1] === ']'));

		if (isJsonLike) {
			return (
				<button
					onClick={() => onShowJson(JSON.parse(strValue), 'JSON Data')}
					className='flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded transition-colors cursor-pointer'>
					<FileJson size={12} />
					<span>JSON</span>
				</button>
			);
		}

		// Use TruncatedCell for text
		return <TruncatedCell text={strValue} />;
	}
);

interface DataTableProps {
	data: Row[];
	columns?: ColumnDef<Row>[];
	totalRows?: number;
	limit?: number;
	isLoading?: boolean;
	isFetching?: boolean; // For blur overlay during pagination/table switch

	headerSlot?: React.ReactNode;
	onPaginationChange?: (updater: any) => void;
	pagination?: { pageIndex: number; pageSize: number };
}

export const DataTable = ({
	data,
	columns: customColumns,
	totalRows,
	limit,
	isLoading,
	isFetching,
	headerSlot,
	onPaginationChange,
	pagination,
}: DataTableProps) => {
	// For JSON Modal
	const [jsonModalData, setJsonModalData] = useState<{
		title: string;
		content: unknown;
	} | null>(null);

	// Memoize to keep defaultColumn stable
	const showJsonModal = useCallback((content: unknown, title = 'JSON Data') => {
		setJsonModalData({ content, title });
		(
			document.getElementById('json_preview_modal') as HTMLDialogElement
		)?.showModal();
	}, []);

	// Use the external CellFormatter - pass memoized showJsonModal
	const defaultColumn: Partial<ColumnDef<Row>> = React.useMemo(
		() => ({
			cell: (info) => (
				<CellFormatter value={info.getValue()} onShowJson={showJsonModal} />
			),
		}),
		[showJsonModal]
	);

	const columns = React.useMemo<ColumnDef<Row>[]>(() => {
		if (customColumns) return customColumns;
		if (!data || data.length === 0) return [];

		// Add selection column
		const selectionColumn: ColumnDef<Row> = {
			id: 'select',
			header: ({ table }) => (
				<input
					type='checkbox'
					checked={table.getIsAllRowsSelected()}
					onChange={table.getToggleAllRowsSelectedHandler()}
					className='checkbox checkbox-xs'
				/>
			),
			cell: ({ row }) => (
				<input
					type='checkbox'
					checked={row.getIsSelected()}
					onChange={row.getToggleSelectedHandler()}
					className='checkbox checkbox-xs'
				/>
			),
			size: 50,
			enableResizing: false,
		};

		const firstRow = data[0];
		if (!firstRow) return [selectionColumn];

		const dataColumns = Object.keys(firstRow).map((key) => ({
			accessorKey: key,
			header: key,
			size: 150, // Default size
		}));

		return [selectionColumn, ...dataColumns];
	}, [customColumns, data]);

	const table = useReactTable({
		data: data ?? [],
		columns,
		defaultColumn,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		enableColumnResizing: true,
		columnResizeMode: 'onChange',
		enableRowSelection: true,
		manualPagination: !!onPaginationChange,
		pageCount: totalRows ? Math.ceil(totalRows / (limit || 100)) : undefined,
		onPaginationChange,
		state: pagination ? { pagination } : undefined,
		initialState:
			!pagination && !onPaginationChange
				? { pagination: { pageSize: limit } }
				: undefined,
	});

	if (isLoading) {
		return (
			<div className='h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 min-h-[400px]'>
				<div className='w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4'></div>
				<p className='text-sm font-medium animate-pulse'>Loading data...</p>
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className='h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 min-h-[400px]'>
				<div className='bg-slate-900 p-4 rounded-full mb-4'>
					<MoreHorizontal size={32} opacity={0.5} />
				</div>
				<p>No results found.</p>
			</div>
		);
	}

	const { pageIndex, pageSize } = table.getState().pagination;

	const pageCount = table.getPageCount();
	const totalRowCount = totalRows || data.length;
	const startRow = pageIndex * pageSize + 1;
	const endRow = Math.min((pageIndex + 1) * pageSize, totalRowCount);

	return (
		<div className='flex flex-col h-full bg-slate-950 overflow-hidden font-sans border border-slate-800 rounded-lg'>
			{/* Header / Toolbar */}
			<div className='flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950 shrink-0'>
				<div>
					<h3 className='text-sm font-semibold text-slate-200'>
						Query Results
					</h3>
					<p className='text-xs text-slate-500 mt-0.5'>
						Showing {startRow}-{endRow} of {totalRowCount} rows
						{table.getSelectedRowModel().rows.length > 0 && (
							<span className='ml-2 text-indigo-400'>
								• {table.getSelectedRowModel().rows.length} selected
							</span>
						)}
					</p>
				</div>

				<div className='flex items-center gap-4'>
					{headerSlot}

					{/* Selection Actions */}
					{table.getSelectedRowModel().rows.length > 0 && (
						<button
							onClick={() => table.resetRowSelection()}
							className='px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors'>
							Clear Selection ({table.getSelectedRowModel().rows.length})
						</button>
					)}

					{/* Pagination Controls */}
					<div className='flex items-center space-x-4 bg-slate-900/50 p-1 rounded-lg border border-slate-800/50'>
						<div className='flex items-center space-x-2 px-2'>
							<span className='text-xs text-slate-500'>Rows:</span>
							<select
								value={pageSize}
								onChange={(e) => table.setPageSize(Number(e.target.value))}
								className='bg-transparent text-xs text-slate-300 focus:outline-none border-b border-slate-700 pb-0.5 cursor-pointer'>
								{[5, 10, 25, 50].map((size) => (
									<option key={size} value={size}>
										{size}
									</option>
								))}
							</select>
						</div>

						<div className='h-4 w-px bg-slate-700'></div>

						<div className='flex items-center space-x-1'>
							<button
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
								className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all'>
								<ChevronsLeft size={14} />
							</button>
							<button
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all'>
								<ChevronLeft size={14} />
							</button>

							<span className='text-xs font-mono text-slate-400 px-2 min-w-[60px] text-center'>
								{pageIndex + 1} / {pageCount || 1}
							</span>

							<button
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all'>
								<ChevronRight size={14} />
							</button>
							<button
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
								className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all'>
								<ChevronsRight size={14} />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Table Area - relative for blur overlay positioning */}
			<div className='flex-1 overflow-auto custom-scrollbar relative'>
				{/* Blur overlay - only covers table, not toolbar */}
				{isFetching && (
					<div className='absolute inset-0 bg-slate-950/30 backdrop-blur-sm z-20 flex items-center justify-center'>
						<div className='flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 shadow-lg'>
							<span className='loading loading-spinner loading-sm text-indigo-400'></span>
							<span className='text-sm text-slate-300'>Loading...</span>
						</div>
					</div>
				)}
				<table className='w-full border-collapse text-left text-sm table-fixed'>
					<thead className='bg-slate-900 sticky top-0 z-10 shadow-sm shadow-black/40'>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{hg.headers.map((header) => (
									<th
										key={header.id}
										style={{ width: header.getSize() }}
										className='px-4 py-3 font-medium text-slate-400 text-xs uppercase tracking-wider border-b border-r border-slate-800 last:border-r-0 whitespace-nowrap group cursor-pointer hover:bg-slate-800 transition-colors relative bg-slate-900'>
										<div className='flex items-center space-x-1'>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
											<ArrowUpDown
												size={10}
												className='opacity-0 group-hover:opacity-50'
											/>
										</div>
										{/* Resizer */}
										<div
											onMouseDown={header.getResizeHandler()}
											className={`absolute right-0 top-0 h-full w-[4px] cursor-col-resize hover:bg-indigo-500/50 ${header.column.getIsResizing() ? 'bg-indigo-500' : ''}`}
										/>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className='divide-y divide-slate-800/50'>
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className={`transition-colors group ${
									row.getIsSelected()
										? 'bg-indigo-500/10 border-l-4 border-l-indigo-500'
										: 'hover:bg-slate-900/40'
								}`}>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className='px-4 py-2.5 whitespace-nowrap border-r border-transparent group-hover:border-slate-800/50 last:border-r-0'>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* JSON PREVIEW MODAL */}
			<dialog id='json_preview_modal' className='modal !duration-100'>
				<div className='modal-box max-w-4xl bg-slate-950 border border-slate-800 text-slate-300 !duration-100'>
					<div className='flex justify-between items-center mb-4'>
						<h3 className='font-bold text-lg text-slate-100'>
							{jsonModalData?.title}
						</h3>
						<form method='dialog'>
							<button className='btn btn-circle btn-ghost btn-sm text-slate-400 hover:text-white cursor-pointer'>
								<X size={20} />
							</button>
						</form>
					</div>
					<div className='py-4'>
						<div className='border border-slate-800 rounded overflow-hidden min-h-[100px] relative bg-slate-900'>
							<JsonViewer value={jsonModalData?.content} maxHeight='500px' />
						</div>
					</div>
					<div className='modal-action'>
						<button
							className='btn btn-outline border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer'
							onClick={() =>
								navigator.clipboard.writeText(
									JSON.stringify(jsonModalData?.content, null, 2)
								)
							}>
							Copy
						</button>
						<form method='dialog'>
							<button className='btn bg-indigo-600 hover:bg-indigo-500 text-white border-none cursor-pointer'>
								Close
							</button>
						</form>
					</div>
				</div>
				<form method='dialog' className='modal-backdrop !duration-100'>
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
};
