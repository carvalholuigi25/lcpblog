// sources: https://lexical.dev/docs/getting-started/react, https://stackblitz.com/edit/facebook-lexical-3mwbtyri
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ToolbarPlugin from '@/app/plugins/toolbarplugins';
import ExampleTheme from './ExampleTheme';

interface MyLexicalEditorPostProps {
    value: string;
    editable: boolean;
    onChange: (e: any) => void;
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

export default function MyEditorPost({ value, editable, onChange }: MyLexicalEditorPostProps) {
    const objeditp = value.includes('children') ? value : '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"'+value+'","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

    const objeditpem = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    const initialConfig = {
        editorState: !!value ? objeditp : objeditpem,
        namespace: 'MyEditorPost',
        theme: ExampleTheme(),
        editable: editable,
        onError: console.error,
    };

    return (
        <div className={"myeditorblk"}>
            <div className="container-fluid">
                <LexicalComposer initialConfig={initialConfig}>
                    <div className="editor-container-fluid">
                        {editable && <ToolbarPlugin />}

                        <div className="editor-inner">
                            <RichTextPlugin
                                contentEditable={
                                    <ContentEditable className={"form-control editor-input" + (!editable ? " " + "no-bordered" : "")} />
                                }
                                placeholder={<p className="txted p-3">Start typing...</p>}
                                ErrorBoundary={({ children }) => <>{children}</>}
                            />

                            {editable && (
                                <>
                                    <AutoFocusPlugin />
                                    <HistoryPlugin />
                                </>
                            )}

                            <MyOnChangePlugin onChange={onChange} />
                        </div>
                    </div>
                </LexicalComposer>
            </div>
        </div>
    );
}