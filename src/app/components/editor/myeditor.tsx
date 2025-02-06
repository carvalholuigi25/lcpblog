// sources: https://lexical.dev/docs/getting-started/react, https://stackblitz.com/edit/facebook-lexical-3mwbtyri
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { $getRoot, $getSelection } from 'lexical';
import { useEffect, useState } from 'react';
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
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
}

export default function MyEditor() {
    const [editorState, setEditorState] = useState("");
    const onChange = (editorState: any) => {
        // Call toJSON on the EditorState object, which produces a serialization safe string
        const editorStateJSON = editorState.toJSON();
        // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
        setEditorState(editorStateJSON ? JSON.stringify(editorStateJSON, null, 4) : "");
    }

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

            {editorState && (
                <div className='container mt-3'>
                    <div className='row'>
                        <div className='col-12' style={{backgroundColor: 'black', color: 'white', padding: 15}}>
                            <p>Preview</p>
                            <pre style={{overflow: 'auto', maxHeight: '600px'}}><code>{editorState}</code></pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}