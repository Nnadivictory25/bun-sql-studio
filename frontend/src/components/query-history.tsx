import { Clock, Copy, Trash2 } from 'lucide-react';
import { memo } from 'react';

interface QueryHistoryProps {
	history: string[];
	onSelect: (sql: string) => void;
	onDelete: (sql: string) => void;
}

export const QueryHistory = memo(function QueryHistory({
	history,
	onSelect,
	onDelete,
}: QueryHistoryProps) {
	return (
		<div className='flex flex-col h-full border border-slate-800 rounded-lg overflow-hidden bg-slate-950 shadow-sm shadow-black/40'>
			<div className='p-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2'>
				<Clock className='size-4 text-slate-400' />
				<span className='font-semibold text-xs text-slate-400 uppercase tracking-wider'>
					Query History
				</span>
			</div>
			<div className='flex-1 overflow-auto p-2 space-y-2 custom-scrollbar'>
				{history.length === 0 ? (
					<div className='text-center text-slate-500 py-8 text-sm italic'>
						No history yet. Run a query!
					</div>
				) : (
					history.map((query, index) => (
						<div
							key={index}
							onClick={() => onSelect(query)}
							className='group relative bg-slate-900/40 hover:bg-slate-900 border border-slate-800/50 hover:border-slate-700 rounded-md p-3 transition-all duration-200 cursor-pointer'>
							<pre className='font-mono text-xs text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap mb-1 opacity-80 group-hover:opacity-100'>
								{query}
							</pre>
							<div className='flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1.5 bg-slate-900/90 p-0.5 rounded shadow-sm backdrop-blur-sm'>
								<button
									className='p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 rounded cursor-pointer transition-colors'
									onClick={(e) => {
										e.stopPropagation();
										onDelete(query);
									}}
									title='Delete from history'>
									<Trash2 size={12} />
								</button>
								<button
									className='p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded cursor-pointer transition-colors'
									onClick={(e) => {
										e.stopPropagation();
										navigator.clipboard.writeText(query);
									}}
									title='Copy to clipboard'>
									<Copy size={12} />
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
});
