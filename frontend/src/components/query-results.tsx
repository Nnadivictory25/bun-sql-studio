import { memo, useState, useMemo } from 'react';
import { DataTable } from './data-table';
import { CircleAlert } from 'lucide-react';

interface QueryResultsProps {
	data: Record<string, unknown>[] | null;
	isLoading: boolean;
	error: Error | null;
}

export const QueryResults = memo(function QueryResults({
	data,
	isLoading,
	error,
}: QueryResultsProps) {
	const [paginationState, setPaginationState] = useState({
		pageIndex: 0,
		pageSize: 50,
	});

	const slicedData = useMemo(() => {
		if (!data) return [];
		const start = paginationState.pageIndex * paginationState.pageSize;
		return data.slice(start, start + paginationState.pageSize);
	}, [data, paginationState.pageIndex, paginationState.pageSize]);

	const queryVersion = useMemo(() => {
		if (!data) return 'empty';
		return `rows:${data.length}`;
	}, [data]);
	if (isLoading) {
		return (
			<div className='h-full flex items-center justify-center p-8'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	if (error) {
		return (
			<div className='h-full flex flex-col items-center justify-center bg-slate-950 text-rose-500 p-4 border border-slate-800 rounded-lg'>
				<CircleAlert size={32} className='mb-2' />
				<h3 className='font-bold mb-1'>Query Error</h3>
				<p className='text-sm text-center font-mono bg-rose-950/30 p-2 rounded border border-rose-900/50'>
					{error.message}
				</p>
			</div>
		);
	}

	if (!data) {
		return (
			<div className='h-full flex flex-col items-center justify-center text-gray-400 p-8'>
				<div className='text-lg font-semibold'>Ready to run</div>
				<p>Execute a query to see results here</p>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className='h-full p-4'>
				<div className='alert alert-info'>
					<span>Query executed successfully. No rows returned.</span>
				</div>
			</div>
		);
	}

	return (
		<DataTable
			key={queryVersion}
			data={slicedData}
			totalRows={data?.length}
			limit={paginationState.pageSize}
			pagination={paginationState}
			onPaginationChange={setPaginationState}
			isLoading={isLoading}
			headerSlot={null}
		/>
	);
});
