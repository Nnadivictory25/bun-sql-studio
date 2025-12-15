import { DataTable } from './data-table';

interface QueryResultsProps {
	data: any[] | null;
	isLoading: boolean;
	error: Error | null;
	executionTime?: number;
}

export const QueryResults = ({ data, isLoading, error }: QueryResultsProps) => {
	if (isLoading) {
		return (
			<div className='h-full flex items-center justify-center p-8'>
				<span className='loading loading-spinner loading-lg'></span>
			</div>
		);
	}

	if (error) {
		return (
			<div className='h-full p-4'>
				<div className='alert alert-error'>
					<span>Error executing query: {error.message}</span>
				</div>
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

	return <DataTable data={data} isLoading={isLoading} />;
};
