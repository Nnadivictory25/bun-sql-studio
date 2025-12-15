import { useState, useMemo } from 'react';
import { useStore } from '@tanstack/react-store';
import { useQuery } from '@tanstack/react-query';
import { store } from '../lib/store';
import { queryQueryOptions, schemaQueryOptions } from '../lib/query-options';
import { QueryEditor } from './query-editor';
import { QueryHistory } from './query-history';
import { QueryResults } from './query-results';

export const SqlStudio = () => {
	// Global store state
	const { currentQuery, queryHistory } = useStore(store, (state) => state);

	// Local state for execution
	const [executionSql, setExecutionSql] = useState<string | null>(null);

	// Fetch schema for autocomplete
	const { data: schemaData } = useQuery(schemaQueryOptions);

	const codeMirrorSchema = useMemo(() => {
		if (!schemaData?.tables) return undefined;
		const s: Record<string, any[]> = {};
		schemaData.tables.forEach((t) => {
			s[t.name] = t.columns.map((c) => ({
				label: c.name,
				type: 'property', // Suggests it's a field
				detail: c.type, // Shows data type (e.g. INTEGER)
				boost: 1, // Give slight priority
			}));
		});
		return s;
	}, [schemaData]);

	const {
		data: queryData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		...queryQueryOptions(executionSql || ''),
		enabled: !!executionSql,
		retry: false,
	});

	const handleQueryChange = (val: string) => {
		store.setState((state) => ({ ...state, currentQuery: val }));
	};

	const handleRunSmart = () => {
		const sql = currentQuery?.trim();
		if (!sql) return;

		if (executionSql === sql) {
			refetch();
		} else {
			setExecutionSql(sql);
		}

		store.setState((state) => {
			/* ... same history logic ... */
			const newHistory = [
				sql,
				...state.queryHistory.filter((h) => h !== sql),
			].slice(0, 50);
			return {
				...state,
				queryHistory: newHistory,
			};
		});
	};

	const handleHistorySelect = (sql: string) => {
		store.setState((state) => ({ ...state, currentQuery: sql }));
	};

	return (
		<div className='h-full flex flex-col gap-2 overflow-hidden'>
			<div className='flex items-center justify-between px-2 shrink-0'>
				<h2 className='text-2xl font-bold'>SQL Query Studio</h2>
			</div>

			<div className='flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 overflow-hidden'>
				{/* Left Column */}
				<div className='flex flex-col gap-4 min-h-0'>
					<div className='h-1/2 min-h-[200px]'>
						<QueryEditor
							value={currentQuery || ''}
							onChange={handleQueryChange}
							onRun={handleRunSmart}
							isRunning={isLoading}
							schema={codeMirrorSchema}
						/>
					</div>
					<div className='h-1/2 min-h-[200px]'>
						<QueryHistory
							history={queryHistory}
							onSelect={handleHistorySelect}
						/>
					</div>
				</div>

				{/* Right Column */}
				<div className='h-full min-h-[400px]'>
					<QueryResults
						data={queryData?.rows || null}
						isLoading={isLoading}
						error={error as Error | null}
					/>
				</div>
			</div>
		</div>
	);
};
