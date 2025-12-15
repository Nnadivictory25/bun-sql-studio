import { sql, SQLite } from '@codemirror/lang-sql';
import CodeMirror from '@uiw/react-codemirror';
import { Play } from 'lucide-react';
import { useMemo } from 'react';

interface QueryEditorProps {
	value: string;
	onChange: (value: string) => void;
	onRun: () => void;
	isRunning?: boolean;
	schema?: Record<string, any[]>;
}

export const QueryEditor = ({
	value,
	onChange,
	onRun,
	isRunning,
	schema,
}: QueryEditorProps) => {
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
		<div className='flex flex-col h-full border border-base-300 rounded-box overflow-hidden bg-base-100'>
			<div className='flex items-center justify-between p-2 bg-base-200 border-b border-base-300'>
				<span className='font-semibold text-sm px-2'>SQL Editor</span>
				<button
					className={`btn btn-sm btn-primary ${isRunning ? 'loading' : ''}`}
					onClick={onRun}
					disabled={!value.trim() || isRunning}>
					{!isRunning && <Play className='size-4' />}
					Run Query
				</button>
			</div>
			<div className='flex-1 overflow-auto'>
				<CodeMirror
					value={value}
					height='100%'
					extensions={extensions}
					onChange={onChange}
					theme='dark' // Assuming dark theme preference or make it dynamic
					className='h-full text-base'
					basicSetup={{
						lineNumbers: true,
						bracketMatching: true,
						closeBrackets: true,
						autocompletion: true,
					}}
				/>
			</div>
		</div>
	);
};
