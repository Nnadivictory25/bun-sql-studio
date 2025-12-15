import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

interface JsonViewerProps {
	value: unknown;
}

const JsonViewer = ({ value }: JsonViewerProps) => {
	const text = useMemo(
		() => (value ? JSON.stringify(value, null, 2) : ''),
		[value]
	);

	return (
		<CodeMirror
			value={text}
			height='auto'
			maxHeight='400px'
			extensions={[json()]}
			editable={false}
			theme='dark'
			basicSetup={{
				lineNumbers: true,
				foldGutter: true,
				highlightActiveLine: false,
			}}
		/>
	);
};

// Default export for lazy loading
export default JsonViewer;
