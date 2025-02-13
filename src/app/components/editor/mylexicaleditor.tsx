/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useCallback, useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import ToolbarPlugin from "@/app/plugins/toolbarplugins";
import HtmlPlugin from "@/app/plugins/htmlplugin";
import SanitizeHTML from "@/app/utils/sanitizehtml";

interface MyLexicalEditorProps {
    field: ControllerRenderProps<any>;
}

export const MyLexicalEditor = ({ field }: MyLexicalEditorProps) => {
    const [editor] = useLexicalComposerContext();
    const [content, setContent] = useState("");
    const [contentHTML, setContentHTML] = useState("");
    const typeContent: string = "all";
    const previewContent: boolean = true;

    const onChange = useCallback((editorState: EditorState) => {
        const mycnt = JSON.stringify(editorState.toJSON(), null, 2);
        setContent(mycnt);
        field.onChange(mycnt);
    }, [field]);

    const onChangeHtml = useCallback((html: string) => {
        setContentHTML(html);
        field.onChange(html);
    }, [field]);

    useEffect(() => {
        return editor.registerUpdateListener(({editorState}) => {
            onChange(editorState);
        });
    }, [editor, onChange, content]);

    return (
        <div className="editor-container-fluid">
            <ToolbarPlugin />
            <div className="editor-inner">
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable className="form-control editor-input" />
                    }
                    placeholder={<p className="txted p-3">Start typing...</p>}
                    ErrorBoundary={({ children }) => <>{children}</>}
                />

                <AutoFocusPlugin />
                <HistoryPlugin />

                {!!previewContent && typeContent == "all" && (
                    <>
                        <div className="editorresblkhtml">
                            <HtmlPlugin 
                                initialHtml={""}
                                onHtmlChanged={onChangeHtml}
                            />
                            <div className="d-block mt-3" dangerouslySetInnerHTML={{ __html: SanitizeHTML(contentHTML) }}></div>
                            <pre className="d-block mt-3"><code>{contentHTML}</code></pre>
                        </div>

                        <div className="editorresblkjson">
                            <OnChangePlugin onChange={onChange} />
                            <pre><code>{content}</code></pre>
                        </div>
                    </>
                )}

                {!!previewContent && typeContent == "html" && (
                    <div className="editorresblkhtml">
                        <HtmlPlugin 
                            initialHtml={""}
                            onHtmlChanged={onChangeHtml}
                        />
                        <pre><code>{contentHTML}</code></pre>
                    </div>
                )}

                {!!previewContent && typeContent == "json" && (
                    <div className="editorresblkjson">
                        <OnChangePlugin onChange={onChange} />
                        <pre><code>{content}</code></pre>
                    </div>
                )}
            </div>
        </div>
    );
};
