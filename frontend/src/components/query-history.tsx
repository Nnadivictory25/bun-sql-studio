import { Clock, Copy, CornerUpLeft, Trash2 } from 'lucide-react';

interface QueryHistoryProps {
	history: string[];
	onSelect: (query: string) => void;
	onDelete: (query: string) => void;
}

export const QueryHistory = ({
	history,
	onSelect,
	onDelete,
}: QueryHistoryProps) => {
	return (
		<div className='flex flex-col h-full border border-base-300 rounded-box overflow-hidden bg-base-100'>
			<div className='p-2 bg-base-200 border-b border-base-300 flex items-center gap-2'>
				<Clock className='size-4' />
				<span className='font-semibold text-sm'>Query History</span>
			</div>
			<div className='flex-1 overflow-auto p-2 space-y-2'>
				{history.length === 0 ? (
					<div className='text-center text-gray-500 py-4 text-sm'>
						No history yet. Run a query!
					</div>
				) : (
					history.map((query, index) => (
						<div
							key={index}
							className='card bg-base-200 shadow-sm p-3 text-sm group hover:bg-base-300 transition-colors'>
							<pre className='font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap mb-2 opacity-70'>
								{query}
							</pre>
							<div className='flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity'>
								<button
									className='btn btn-xs btn-ghost text-error'
									onClick={(e) => {
										e.stopPropagation();
										onDelete(query);
									}}
									title='Delete from history'>
									<Trash2 className='size-3' />
								</button>
								<button
									className='btn btn-xs btn-ghost'
									onClick={() => navigator.clipboard.writeText(query)}
									title='Copy to clipboard'>
									<Copy className='size-3' />
								</button>
								<button
									className='btn btn-xs btn-primary'
									onClick={() => onSelect(query)}
									title='Use this query'>
									<CornerUpLeft className='size-3' />
									Use
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};
