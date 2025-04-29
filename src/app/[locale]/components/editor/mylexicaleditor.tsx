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
import ToolbarPlugin from "@applocale/components/editor/plugins/toolbarplugins";
import HtmlPlugin from "@applocale/components/editor/plugins/htmlplugin";
import SanitizeHTML from "@applocale/utils/sanitizehtml";

interface MyLexicalEditorProps {
    field: ControllerRenderProps<any>;
    typeContent: string;
    previewContent: boolean;
}

export const MyLexicalEditor = ({ field, typeContent, previewContent }: MyLexicalEditorProps) => {
    const [editor] = useLexicalComposerContext();
    const [content, setContent] = useState("");
    const [contentHTML, setContentHTML] = useState("");

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

    const getHTMLContent = () => {
        return (
            <div className="editorresblkhtml">
                <HtmlPlugin 
                    initialHtml={""}
                    onHtmlChanged={onChangeHtml}
                />

                {!!previewContent && (
                    <>
                        <div className="d-block mt-3" dangerouslySetInnerHTML={{ __html: SanitizeHTML(contentHTML) }}></div>
                        <pre><code>{contentHTML}</code></pre>       
                    </>
                )}
            </div>
        );
    }

    const getJSONContent = () => {
        return (
            <div className="editorresblkjson">
                <OnChangePlugin onChange={onChange} />

                {!!previewContent && (
                    <pre><code>{content}</code></pre>
                )}
            </div>
        );
    }

    const getAllContent = () => {
        return (
            <>
                {getHTMLContent()}
                {getJSONContent()}
            </>
        );
    }

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

                {typeContent == "all" && getAllContent()}
                {typeContent == "html" && getHTMLContent()}
                {typeContent == "json" && getJSONContent()}
            </div>
        </div>
    );
};
