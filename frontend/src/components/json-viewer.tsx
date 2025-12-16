import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { customDarkTheme } from './codemirror-theme';
import { useMemo } from 'react';

interface JsonViewerProps {
	value: unknown;
	maxHeight?: string;
}

const JsonViewer = ({ value, maxHeight = '400px' }: JsonViewerProps) => {
	const jsonString = useMemo(() => {
		return typeof value === 'string'
			? value
			: (JSON.stringify(value, null, 2) ?? '');
	}, [value]);

	return (
		<CodeMirror
			value={jsonString}
			height='auto'
			maxHeight={maxHeight}
			extensions={[json()]}
			editable={false}
			theme={customDarkTheme}
			basicSetup={false}
		/>
	);
};

export default JsonViewer;
