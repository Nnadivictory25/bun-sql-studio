import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const slateDarkTheme = EditorView.theme(
    {
        '&': {
            color: '#cbd5e1', // slate-300
            backgroundColor: 'transparent', // Let container handle bg
            height: '100%',
        },
        '.cm-content': {
            caretColor: '#818cf8', // indigo-400
            fontFamily: 'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
        },
        '.cm-cursor': {
            borderLeftColor: '#818cf8',
        },
        '&.cm-focused .cm-cursor': {
            borderLeftColor: '#818cf8',
        },
        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
            backgroundColor: '#3730a3 !important', // indigo-900
        },
        '.cm-panels': { backgroundColor: '#0f172a', color: '#cbd5e1' },
        '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
        '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

        '.cm-gutters': {
            backgroundColor: 'transparent',
            color: '#475569', // slate-600
            border: 'none',
        },
        '.cm-activeLineGutter': {
            backgroundColor: 'transparent',
            color: '#94a3b8', // slate-400
        },
        '.cm-lineNumbers .cm-gutterElement': {
            paddingLeft: '8px',
            cursor: 'default',
        },
        '.cm-activeLine': { backgroundColor: '#1e293b50' }, // slate-800/50
        '.cm-selectionMatch': { backgroundColor: '#3730a3' },
    },
    { dark: true }
);

const slateHighlightStyle = HighlightStyle.define([
    { tag: t.keyword, color: '#c084fc' }, // purple-400
    { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: '#bae6fd' }, // sky-200
    { tag: [t.function(t.variableName), t.labelName], color: '#f472b6' }, // pink-400
    { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: '#fb923c' }, // orange-400
    { tag: [t.definition(t.name), t.separator], color: '#e2e8f0' }, // slate-200
    { tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#38bdf8' }, // sky-400 (numbers)
    { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: '#818cf8' }, // indigo-400
    { tag: [t.meta, t.comment], color: '#64748b', fontStyle: 'italic' }, // slate-500
    { tag: t.strong, fontWeight: 'bold' },
    { tag: t.emphasis, fontStyle: 'italic' },
    { tag: t.strikethrough, textDecoration: 'line-through' },
    { tag: t.link, color: '#94a3b8', textDecoration: 'underline' },
    { tag: t.heading, fontWeight: 'bold', color: '#f8fafc' },
    { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#f87171' }, // red-400 (bools)
    { tag: [t.processingInstruction, t.string, t.inserted], color: '#4ade80' }, // green-400 (strings)
    { tag: t.invalid, color: '#ff0000' },
]);

export const customDarkTheme = [slateDarkTheme, syntaxHighlighting(slateHighlightStyle)];
