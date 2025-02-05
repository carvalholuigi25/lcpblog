"use client";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill-new";
import { markdownToHtml, htmlToMarkdown } from "./parser";

import 'react-quill-new/dist/quill.snow.css';


export interface EditorContentChanged {
    html: string;
    markdown: string;
}

export interface EditorProps {
    value?: string;
    onChange?: (changes: EditorContentChanged) => void;
}

export default function Editor(props: EditorProps) {
    const [value, setValue] = useState<string>(markdownToHtml(props.value || ""));
    const reactQuillRef = useRef<ReactQuill>(null);

    const onChange = (content: string) => {
        setValue(content);

        if (props.onChange) {
            props.onChange({
                html: content,
                markdown: htmlToMarkdown(content)
            });
        }
    };

    /*
    * Quill editor modules
    * See https://quilljs.com/docs/modules#modules
    */
    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    };

    /*
    * Quill editor formats
    * See https://quilljs.com/docs/formats/
    */
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'indent',
        'link',
        'image',
        'video',
    ];

    return (
        <ReactQuill 
            ref={reactQuillRef} 
            modules={modules} 
            formats={formats} 
            value={value} 
            onChange={onChange} 
            theme="snow" 
        />
    )
}