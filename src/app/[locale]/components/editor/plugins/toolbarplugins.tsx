/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {useCallback, useEffect, useRef, useState} from 'react';
import {mergeRegister} from '@lexical/utils';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $getSelection, $isRangeSelection,
  CAN_REDO_COMMAND, CAN_UNDO_COMMAND,
  CLEAR_EDITOR_COMMAND, CLEAR_HISTORY_COMMAND, FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND, REDO_COMMAND,
  SELECTION_CHANGE_COMMAND, UNDO_COMMAND,
} from 'lexical';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

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
      editor.registerUpdateListener(({editorState}) => {
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

  const clearEditor = (e: any) => {
    e.preventDefault();
    setCanClear(!canClear);
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
  }

  const clearHistory = (e: any) => {
    e.preventDefault();
    setCanClear(!canClear);
    setCanClearHistory(!canClearHistory);
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
  }

  const undoEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }

  const redoEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }

  const boldElementEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }

  const italicElementEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }

  const underlineElementEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  }

  const strikeElementEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  }

  const leftElementEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
  }

  const centerElementEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
  }

  const rightElementEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
  }

  const justifyElementEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
  }

  const codeElementEditor = (e: any) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  }

  const linkElementEditor = (e: any) => {
    e.preventDefault();
    setIsLink((prev) => !prev);
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
      url: 'https://www.google.com/',
    });
  }

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button disabled={!canClear} onClick={clearEditor} className="toolbar-item spaced" aria-label="Clear">
        <i className="bi bi-x-circle" />
      </button>
      <button disabled={!canClearHistory} onClick={clearHistory} className="toolbar-item spaced" aria-label="Clear">
        <i className="bi bi-stars" />
      </button>
      <button disabled={!canUndo} onClick={undoEditor} className="toolbar-item spaced" aria-label="Undo">
        <i className="format undo" />
      </button>
      <button disabled={!canRedo} onClick={redoEditor} className="toolbar-item" aria-label="Redo">
        <i className="format redo" />
      </button>
      <Divider />
      <button onClick={boldElementEditor} className={'toolbar-item spaced ' + (isBold ? 'active' : '')} aria-label="Format Bold">
        <i className="format bold" />
      </button>
      <button onClick={italicElementEditor} className={'toolbar-item spaced ' + (isItalic ? 'active' : '')} aria-label="Format Italics">
        <i className="format italic" />
      </button>
      <button onClick={underlineElementEditor} className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')} aria-label="Format Underline">
        <i className="format underline" />
      </button>
      <button onClick={strikeElementEditor} className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')} aria-label="Format Strikethrough">
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button onClick={leftElementEditor} className="toolbar-item spaced" aria-label="Left Align">
        <i className="format left-align" />
      </button>
      <button onClick={centerElementEditor} className="toolbar-item spaced" aria-label="Center Align">
        <i className="format center-align" />
      </button>
      <button onClick={rightElementEditor} className="toolbar-item spaced" aria-label="Right Align">
        <i className="format right-align" />
      </button>
      <button onClick={justifyElementEditor} className="toolbar-item" aria-label="Justify Align">
        <i className="format justify-align" />
      </button>
      <Divider />
      <button onClick={codeElementEditor} className={'toolbar-item spaced ' + (isCode ? 'active' : '')} aria-label="Code">
        <i className="format bi bi-code" />
      </button>
      <button onClick={linkElementEditor} className={'toolbar-item spaced ' + (isLink ? 'active' : '')} aria-label="Link">
        <i className="format bi bi-link" />
      </button>{' '}
    </div>
  );
}
