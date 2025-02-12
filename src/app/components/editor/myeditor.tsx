// sources: https://lexical.dev/docs/getting-started/react, https://stackblitz.com/edit/facebook-lexical-3mwbtyri
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { $getRoot, $getSelection } from 'lexical';
import { useEffect } from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ToolbarPlugin from '@/app/plugins/toolbarplugins';
import ExampleTheme from './ExampleTheme';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
    console.error(error);
}

function MyOnChangePlugin({ onChange }: any) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editor.parseEditorState(editorState.toJSON()));
        });
    }, [editor, onChange]);
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function MyEditor({value, onChange}: {value: string, onChange: any}) {
    const initialConfig = {
        namespace: 'MyEditor',
        theme: ExampleTheme(),
        onError,
    };

    return (
        <div className={"myeditorblk"}>
            <LexicalComposer initialConfig={initialConfig}>
                <div className="editor-container-fluid">
                    <ToolbarPlugin />
                    <div className="editor-inner">
                        <RichTextPlugin
                            contentEditable={<ContentEditable />}
                            placeholder={<div className="editor-placeholder">Enter some text...</div>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <MyOnChangePlugin onChange={onChange} />
                    </div>
                </div>
            </LexicalComposer>
        </div>
    );
}