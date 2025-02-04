"use client";
import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import SanitizeHTML from '../utils/sanitizehtml';

export default function Editor() {
    const [value, setValue] = useState('');

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
        },
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
        <>
            <ReactQuill modules={modules} formats={formats} value={value} onChange={setValue} theme="snow" />
            <div className='col-12 mt-3'>
                <p>Preview:</p>
                
                <p className='mt-3'>JSON:</p>
                <pre style={{background: 'black', color: 'white', padding: '15px', maxHeight: '500px', overflow: 'auto'}}>
                    <code style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify({ data: value }, null, 4)}
                    </code>
                </pre>

                <p className='mt-3'>JSON (minified):</p>
                <pre style={{background: 'black', color: 'white', padding: '15px', maxHeight: '500px', overflow: 'auto'}}>
                    <code style={{ whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify({ data: value }, null, 0)}
                    </code>
                </pre>
                
                <p className='mt-3'>HTML (dirty): </p>
                <pre style={{background: 'black', color: 'white', padding: '15px', maxHeight: '500px', overflow: 'auto'}}>
                    <code style={{ whiteSpace: 'pre-line' }}>
                        {value}
                    </code>
                </pre>
                
                <p className='mt-3'>HTML (clean): </p>
                <div className='ql-snow'>
                    <div dangerouslySetInnerHTML={{ __html: SanitizeHTML(value) }} className='ql-editor' style={{background: 'black', color: 'white', padding: '15px', maxHeight: '500px', overflow: 'auto', fontFamily: 'inherit'}} />
                </div>
            </div>
        </>
    )
}