// sources: https://lexical.dev/docs/getting-started/react, https://stackblitz.com/edit/facebook-lexical-3mwbtyri
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Suspense, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LinkNode } from '@lexical/link';
import { CodeNode } from '@lexical/code';
import { ListNode, ListItemNode } from '@lexical/list';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TRANSFORMERS } from '@applocale/components/editor/transformers/markdowntransformer';
import ToolbarPlugin from '@applocale/plugins/toolbarplugins';
import LoadingComp from '@applocale/components/loadingcomp';
import ExampleTheme from '@applocale/components/editor/ExampleTheme';

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
    const t = useTranslations("ui.editors");
    const objeditp = value.includes('children') ? value : '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"' + value + '","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

    const objeditpem = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    const nodes = [LinkNode, ListNode, ListItemNode, HeadingNode, HorizontalRuleNode, QuoteNode, CodeNode, TableNode, TableCellNode, TableRowNode];

    const initialConfig = {
        editorState: !!value ? objeditp : objeditpem,
        namespace: 'MyEditorPost',
        theme: ExampleTheme(),
        nodes: nodes,
        editable: editable,
        onError: console.error,
    };

    return (
        <div className={"myeditorblk"}>
            <div className="container-fluid p-0">
                <Suspense fallback={<LoadingComp type="icon" icontype="ring" />}>
                    <LexicalComposer initialConfig={initialConfig}>
                        <div className="editor-container-fluid">
                            {editable && <ToolbarPlugin />}

                            <div className="editor-inner">
                                <RichTextPlugin
                                    contentEditable={
                                        <ContentEditable className={"form-control editor-input-prev" + (!editable ? " " + "no-bordered" : "")} />
                                    }
                                    placeholder={<p className="txted p-3">{t('edplaceholder') ?? "Start typing..."}</p>}
                                    ErrorBoundary={({ children }) => <>{children}</>}
                                />

                                {editable && (
                                    <>
                                        <AutoFocusPlugin />
                                        <HistoryPlugin />
                                        <LinkPlugin />
                                        <ListPlugin />
                                        <CheckListPlugin />
                                        <TablePlugin />
                                        <TabIndentationPlugin />
                                        <ClearEditorPlugin />
                                        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                                        <HorizontalRulePlugin />
                                    </>
                                )}

                                <MyOnChangePlugin onChange={onChange} />
                            </div>
                        </div>
                    </LexicalComposer>
                </Suspense>
            </div>
        </div>
    );
}