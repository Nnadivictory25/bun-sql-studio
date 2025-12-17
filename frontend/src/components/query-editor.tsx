import { sql, SQLite } from '@codemirror/lang-sql';
import CodeMirror from '@uiw/react-codemirror';
import { Play } from 'lucide-react';
import { useMemo, memo } from 'react';
import { customDarkTheme } from './codemirror-theme';

interface SchemaSuggestion {
	label: string;
	type: string;
	detail: string;
	boost: number;
}

interface QueryEditorProps {
	value: string;
	onChange: (value: string) => void;
	onRun: () => void;
	isRunning?: boolean;
	schema?: Record<string, SchemaSuggestion[]>;
}

export const QueryEditor = memo(function QueryEditor({
	value,
	onChange,
	onRun,
	isRunning,
	schema,
}: QueryEditorProps) {
	const extensions = useMemo(
		() => [
			sql({
				dialect: SQLite,
				schema,
				upperCaseKeywords: true,
			}),
		],
		[schema]
	);

	return (
		<div className='flex flex-col h-full border border-slate-800 rounded-lg overflow-hidden bg-black shadow-sm shadow-black/40'>
			<div className='flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800'>
				<span className='font-semibold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2'>
					<span className='w-1.5 h-1.5 rounded-full bg-indigo-500'></span>
					SQL Editor
				</span>
				<button
					className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
						!value.trim() || isRunning
							? 'bg-slate-800 text-slate-500 cursor-not-allowed'
							: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer'
					}`}
					onClick={onRun}
					disabled={!value.trim() || isRunning}>
					{isRunning ? (
						<div className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
					) : (
						<Play size={14} fill='currentColor' />
					)}
					<span>Run</span>
				</button>
			</div>
			<div className='flex-1 overflow-auto bg-black'>
				{' '}
				{/* Matching CodeMirror Dark Background usually */}
				<CodeMirror
					value={value}
					height='100%'
					extensions={extensions}
					onChange={onChange}
					theme={customDarkTheme}
					className='h-full text-base'
					basicSetup={{
						lineNumbers: true,
						bracketMatching: true,
						closeBrackets: true,
						autocompletion: true,
						highlightActiveLine: false,
						highlightSelectionMatches: true,
					}}
				/>
			</div>
		</div>
	);
});
