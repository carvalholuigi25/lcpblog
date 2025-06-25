// sources: https://lexical.dev/docs/getting-started/react, https://stackblitz.com/edit/facebook-lexical-3mwbtyri
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Suspense, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
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
import { AutoLinkPlugin as LexicalAutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin'
import { TRANSFORMERS } from '@applocale/components/ui/editor/transformers/markdowntransformer';
import ToolbarPlugin from '@applocale/components/ui/editor/plugins/toolbarplugins';
import LoadingComp from '@applocale/components/ui/loadingcomp';
import ExampleTheme from '@applocale/components/ui/editor/ExampleTheme';
import { $getRoot } from "lexical";

export let TXTLEN: number = 0;
export let LINELEN: number = 0;

export const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export const MATCHERS = [
  (text: any) => {
    const match = URL_MATCHER.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
      attributes: { rel: 'noreferrer', target: '_blank' }, // Optional link attributes
    };
  },
];

interface MyLexicalEditorPostProps {
    keyid: string;
    value: string;
    editable: boolean;
    onChange: (e: any) => void;
    isCleared?: boolean;
    content?: string;
    showStatus?: boolean;
}

function MyOnChangePlugin({ onChange }: any) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);

            editorState.read(() => {
                const root = $getRoot();
                const txtCount = root.getTextContent().trim().length;
                const lineCount = root.getChildren().length;
                TXTLEN = txtCount;
                LINELEN = lineCount;
            });
        });
    }, [editor, onChange]);
    return null;
}

export default function MyEditorPost({ keyid, value, editable, onChange, isCleared, content, showStatus }: MyLexicalEditorPostProps) {
    const t = useTranslations("ui.editors");
    const objeditp = value.includes('children') ? value : '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"' + value + '","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';
    const objeditpem = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    const nodes = [AutoLinkNode, CodeHighlightNode, LinkNode, ListNode, ListItemNode, HeadingNode, HorizontalRuleNode, QuoteNode, CodeNode, TableNode, TableCellNode, TableRowNode];

    const initialConfig = {
        editorState: !!value ? objeditp : objeditpem,
        namespace: 'MyEditorPost',
        theme: ExampleTheme(),
        nodes: nodes,
        editable: editable,
        onError: console.error,
    };

    const getPlugins = () => {
        return (
            <>
                <AutoFocusPlugin />
                <HistoryPlugin />
                <LinkPlugin />
                <ListPlugin />
                <CheckListPlugin />
                <TablePlugin />
                <TabIndentationPlugin />
                <ClearEditorPlugin />
                <HorizontalRulePlugin />
                <LexicalAutoLinkPlugin matchers={MATCHERS} />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            </>
        )
    }

    const getLoading = () => {
        return (
            <LoadingComp type="icon" icontype="ring" />
        )
    }

    const getPlaceholder = () => {
        return (
            <p className="txted p-3">{t('edplaceholder') ?? "Start typing..."}</p>
        )
    }

    const getContentEditable = () => {
        return (
            <ContentEditable className={"form-control editor-input-prev" + (!editable ? " " + "no-bordered" : "")} />
        )
    }

    const getErrorBoundary = ({ children }: any) => {
        return (
            <>{children}</>
        )
    }

    return (
        <div className={"myeditorblk"}>
            <div className="container-fluid p-0">
                <Suspense fallback={getLoading()}>
                    <LexicalComposer key={keyid} initialConfig={initialConfig}>
                        <div className="editor-container-fluid">
                            {editable && <ToolbarPlugin isCleared={isCleared} content={content} />}

                            <div className="editor-inner">
                                <RichTextPlugin
                                    contentEditable={getContentEditable()}
                                    placeholder={getPlaceholder()}
                                    ErrorBoundary={(children) => getErrorBoundary(children)}
                                />

                                {editable && (getPlugins())}
                                <MyOnChangePlugin onChange={onChange} />
                            </div>

                            {showStatus && (
                                <div className="editor-footer">
                                    <small className='status'>Nº of Lines: {LINELEN} || Nº of Words: {TXTLEN}</small>
                                </div>
                            )}
                        </div>
                    </LexicalComposer>
                </Suspense>
            </div>
        </div>
    );
}