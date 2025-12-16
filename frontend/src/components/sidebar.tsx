import { useQuery } from '@tanstack/react-query';
import { tablesQueryOptions } from '../lib/query-options';
import { Database, Table as TableIcon, Settings, Code2 } from 'lucide-react';
import { useStore } from '@tanstack/react-store';
import { store } from '../lib/store';

export const Sidebar = () => {
	const { data, isLoading, error } = useQuery(tablesQueryOptions);
	const selectedTable = useStore(store, (state) => state.currentTable);
	const tables = data?.tables || [];

	// If no table is selected and we have tables, select the first one
	// Keeping this logic as it was in original
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
			// We might want to switch view here if we had view state
		}));
	}

	// Placeholder for view switching if we implement it fully later
	// For now, we just have the SQL Studio in a drawer in the main App
	const openSqlStudio = () => {
		const drawerCheckbox = document.getElementById(
			'sql-studio-drawer'
		) as HTMLInputElement;
		if (drawerCheckbox) drawerCheckbox.checked = true;
	};

	return (
		<div className='w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full text-slate-300 font-sans'>
			{/* Header */}
			<div className='p-4 border-b border-slate-800 flex items-center space-x-2 shrink-0'>
				<div className='w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20'>
					<Database size={18} />
				</div>
				<span className='font-bold text-slate-100 tracking-tight'>
					Bun SQL Studio
				</span>
			</div>

			{/* Main Nav */}
			<div className='flex flex-col p-3 space-y-1 shrink-0'>
				<button
					onClick={openSqlStudio}
					className='flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 bg-white text-slate-950 hover:bg-slate-100 shadow-sm font-semibold cursor-pointer'>
					<Code2 size={18} className='text-indigo-600' />
					<span className='text-sm'>SQL Studio</span>
				</button>
			</div>

			{/* Database Explorer */}
			<div className='flex-1 overflow-y-auto mt-4 px-3 custom-scrollbar'>
				<div className='flex items-center justify-between mb-2 px-2'>
					<span className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
						Tables
					</span>
					<span className='text-xs bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800'>
						{tables.length}
					</span>
				</div>

				{isLoading ? (
					<div className='space-y-2 p-2'>
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className='h-8 bg-slate-900/50 rounded animate-pulse'
							/>
						))}
					</div>
				) : error ? (
					<div className='p-2 text-red-400 text-xs text-center border border-red-900/50 rounded bg-red-900/10'>
						{(error as Error).message}
					</div>
				) : (
					<div className='space-y-0.5'>
						{tables.map((table) => (
							<button
								key={table.name}
								onClick={() => handleTableSelect(table.name)}
								className={`w-full group flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 text-sm cursor-pointer ${
									selectedTable === table.name
										? 'bg-slate-800 text-white'
										: 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
								}`}>
								<div className='flex items-center space-x-3 truncate'>
									<TableIcon
										size={16}
										className={
											selectedTable === table.name
												? 'text-indigo-400'
												: 'text-slate-600 group-hover:text-slate-400'
										}
									/>
									<span className='truncate'>{table.name}</span>
								</div>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Connection Info / Footer */}
			<div className='p-4 border-t border-slate-800 bg-slate-950/50 shrink-0'>
				<div className='flex items-center space-x-3 text-xs text-slate-500 mb-3'>
					<div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
					<span>Connected: Local DB</span>
				</div>
				<button className='flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors w-full px-2 py-1.5 rounded hover:bg-slate-900 cursor-pointer'>
					<Settings size={16} />
					<span className='text-xs'>Settings</span>
				</button>
			</div>
		</div>
	);
};
