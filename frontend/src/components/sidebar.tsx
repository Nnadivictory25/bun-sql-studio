import { useQuery } from '@tanstack/react-query';
import { tablesQueryOptions } from '../lib/query-options';
import { Table2 } from 'lucide-react';
import { useStore } from '@tanstack/react-store';
import { store } from '../lib/store';

export const Sidebar = () => {
	const { data, isLoading, error } = useQuery(tablesQueryOptions);
	const selectedTable = useStore(store, (state) => state.currentTable);
	const tables = data?.tables || [];

	// If no table is selected and we have tables, select the first one
	if (!selectedTable && tables.length) {
		store.setState((state) => ({
			...state,
			currentTable: tables[0].name,
		}));
	}

	function handleTableSelect(tableName: string) {
		store.setState((state) => ({
			...state,
			currentTable: tableName,
		}));
	}

	return (
		<div className='sidebar'>
			{isLoading ? (
				<Skeleton />
			) : error ? (
				<Error message={error.message} />
			) : tables.length === 0 ? (
				<p className='text-gray-400 text-center'>No tables found!</p>
			) : (
				<div className='flex flex-col gap-1'>
					{tables.map((table) => (
						<button
							key={table.name}
							className={`h-10 px-4 rounded-md w-full cursor-pointer flex items-center gap-2 hover:bg-gray-700 ${selectedTable === table.name ? 'bg-primary text-primary-content hover:bg-primary hover:text-primary-content font-medium' : ''}`}
							onClick={() => handleTableSelect(table.name)}>
							<Table2 className='size-4' />
							{table.name}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

const Skeleton = () => {
	return (
		<div className='flex flex-col gap-2'>
			{Array.from({ length: 3 }).map((_, index) => (
				<div key={index} className='h-10 w-full skeleton rounded-md'></div>
			))}
		</div>
	);
};

const Error = ({ message }: { message: string }) => {
	return (
		<div className='flex flex-col gap-2'>
			<div className='h-10 w-full bg-red-500 rounded-md'>{message}</div>
		</div>
	);
};
