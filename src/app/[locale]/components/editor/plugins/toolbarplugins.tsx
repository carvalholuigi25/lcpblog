/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection, $isRangeSelection,
  CAN_REDO_COMMAND, CAN_UNDO_COMMAND,
  CLEAR_EDITOR_COMMAND, CLEAR_HISTORY_COMMAND, FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND, REDO_COMMAND,
  SELECTION_CHANGE_COMMAND, UNDO_COMMAND,
} from 'lexical';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';

export default function ToolbarPlugin() {
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
  const LowPriority = 1;

  const Divider = () => {
    return <div className="divider" />;
  }

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
    }
  }, []);

  useEffect(() => {
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
      )
    );
  }, [editor, $updateToolbar]);

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
      } else {
        setIsLink((prev) => !prev);
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
          url: 'https://www.google.com/',
        });
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
        <Divider />
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
        <Divider />
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
        <Divider />
        <button onClick={(e) => doCMD(e, "misc", "code")} className={'toolbar-item spaced ' + (isCode ? 'active' : '')} aria-label="Code">
          <i className="format bi bi-code" />
        </button>
        <button onClick={(e) => doCMD(e, "misc", "link")} className={'toolbar-item spaced ' + (isLink ? 'active' : '')} aria-label="Link">
          <i className="format bi bi-link" />
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
