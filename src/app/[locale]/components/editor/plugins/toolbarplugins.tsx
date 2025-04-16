/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection, $isRangeSelection,
  CAN_REDO_COMMAND, CAN_UNDO_COMMAND,
  CLEAR_EDITOR_COMMAND, CLEAR_HISTORY_COMMAND,
  FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  REDO_COMMAND, SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND
} from 'lexical';
import { $insertList, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND } from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';

export default function ToolbarPlugin({ isCleared }: { isCleared?: boolean }) {
  const toolbarRef = useRef(null);
  const [editor] = useLexicalComposerContext();
  const [canClear, setCanClear] = useState(false);
  const [canClearHistory, setCanClearHistory] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState<boolean>(false);
  const [isListUnordered, setIsListUnordered] = useState<boolean>(false);
  const [isListOrdered, setIsListOrdered] = useState<boolean>(false);
  const [isListChecked, setIsListChecked] = useState<boolean>(false);
  const LowPriority = 1;

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
    }
  }, []);

  useEffect(() => {
    if(isCleared) {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      editor.focus();
    }

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanClearHistory(payload);
          setCanClear(payload);
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          $insertList('bullet');
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          $insertList('number');
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        INSERT_CHECK_LIST_COMMAND,
        () => {
          $insertList('check');
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar, isCleared]);

  const doCMD = (e: any, action: string, type: string = "general") => {
    e.preventDefault();

    if (action == "general") {
      if (type == "clear") {
        setCanClear(!canClear);
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
      } else if (type == "clearHistory") {
        setCanClear(!canClear);
        setCanClearHistory(!canClearHistory);
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      } else if (type == "undo") {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
      } else {
        editor.dispatchCommand(REDO_COMMAND, undefined);
      }
    } else if (action == "style") {
      if (type == "bold") {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      } else if (type == "italic") {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      } else if (type == "underline") {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      } else {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      }
    } else if (action == "alignment") {
      if (type == "left") {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
      } else if (type == "center") {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
      } else if (type == "right") {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
      } else {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
      }
    } else {
      if (type == "code") {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      } else if (type == "link") {
        setIsLink((prev) => !prev);
        const url = prompt("Please write the url here", "https://www.google.com");

        if(url != null) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
            url: url,
          });
        }
      } else if (type == "listUnordered") {
        setIsListOrdered(false);
        setIsListChecked(false);
        setIsListUnordered(!isListUnordered);
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else if (type == "listOrdered") {
        setIsListUnordered(false);
        setIsListChecked(false);
        setIsListOrdered(!isListOrdered);
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else if (type == "listCheck") {
        setIsListOrdered(false);
        setIsListUnordered(false);
        setIsListChecked(!isListChecked);
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
      }
    }
  }

  const getElements = () => {
    return (
      <>
        <button disabled={!canClear} onClick={(e) => doCMD(e, "general", "clear")} className="toolbar-item spaced" aria-label="Clear">
          <i className="bi bi-x-circle" />
        </button>
        <button disabled={!canClearHistory} onClick={(e) => doCMD(e, "general", "clearHistory")} className="toolbar-item spaced" aria-label="Clear">
          <i className="bi bi-stars" />
        </button>
        <button disabled={!canUndo} onClick={(e) => doCMD(e, "general", "undo")} className="toolbar-item spaced" aria-label="Undo">
          <i className="format undo" />
        </button>
        <button disabled={!canRedo} onClick={(e) => doCMD(e, "general", "redo")} className="toolbar-item" aria-label="Redo">
          <i className="format redo" />
        </button>
        <button onClick={(e) => doCMD(e, "style", "bold")} className={'toolbar-item spaced ' + (isBold ? 'active' : '')} aria-label="Format Bold">
          <i className="format bold" />
        </button>
        <button onClick={(e) => doCMD(e, "style", "italic")} className={'toolbar-item spaced ' + (isItalic ? 'active' : '')} aria-label="Format Italics">
          <i className="format italic" />
        </button>
        <button onClick={(e) => doCMD(e, "style", "underline")} className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')} aria-label="Format Underline">
          <i className="format underline" />
        </button>
        <button onClick={(e) => doCMD(e, "style", "strikethrough")} className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')} aria-label="Format Strikethrough">
          <i className="format strikethrough" />
        </button>
        <button onClick={(e) => doCMD(e, "alignment", "left")} className="toolbar-item spaced" aria-label="Left Align" >
          <i className="format left-align" />
        </button >
        <button onClick={(e) => doCMD(e, "alignment", "center")} className="toolbar-item spaced" aria-label="Center Align">
          <i className="format center-align" />
        </button>
        <button onClick={(e) => doCMD(e, "alignment", "right")} className="toolbar-item spaced" aria-label="Right Align">
          <i className="format right-align" />
        </button>
        <button onClick={(e) => doCMD(e, "alignment", "justify")} className="toolbar-item" aria-label="Justify Align">
          <i className="format justify-align" />
        </button>
        <button onClick={(e) => doCMD(e, "misc", "code")} className={'toolbar-item spaced ' + (isCode ? 'active' : '')} aria-label="Code">
          <i className="bi bi-code" />
        </button>
        <button onClick={(e) => doCMD(e, "misc", "link")} className={'toolbar-item spaced ' + (isLink ? 'active' : '')} aria-label="Link">
          <i className="bi bi-link" />
        </button>
        <button onClick={(e) => doCMD(e, "misc", "listUnordered")} className={'toolbar-item spaced ' + (isListUnordered ? 'active' : '')} aria-label='List Unordered'>
          <i className="bi bi-list-ul" />
        </button>
        <button onClick={(e) => doCMD(e, "misc", "listOrdered")} className={'toolbar-item spaced ' + (isListOrdered ? 'active' : '')} aria-label='List Ordered'>
          <i className="bi bi-list-ol" />
        </button>
        <button onClick={(e) => doCMD(e, "misc", "listCheck")} className={'toolbar-item spaced ' + (isListChecked ? 'active' : '')} aria-label='List Check'>
          <i className="bi bi-list-check" />
        </button>
        <button onClick={(e) => doCMD(e, "misc", "paragraph")} className={'toolbar-item spaced ' + (isLink ? 'active' : '')} aria-label="Paragraph">
          <i className="bi bi-paragraph" />
        </button>
      </>
    )
  }

  return (
    <div className="toolbar" ref={toolbarRef}>
      {getElements()}
    </div>
  );
}
