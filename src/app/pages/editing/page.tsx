"use client";
import { useState } from "react";
import Editor, { EditorContentChanged } from "@/app/components/editor/editor";
import Footer from "@/app/ui/footer";
import Header from "@/app/ui/header";
import styles from "@/app/page.module.scss";
import SanitizeHTML from "@/app/utils/sanitizehtml";

export default function EditingPage() {
    const [editorHtmlValue, setEditorHtmlValue] = useState<string>("");
    const [editorMarkdownValue, setEditorMarkdownValue] = useState<string>("");

    const onEditorContentChanged = (content: EditorContentChanged) => {
        setEditorHtmlValue(content.html);
        setEditorMarkdownValue(content.markdown);
    };

    return (
        <div className={styles.page} id="editing">
            <Header />
            <section className={styles.section + " " + styles.pstretch} style={{ padding: '5rem 15px' }}>
                <Editor value="" onChange={onEditorContentChanged} />

                <div className='col-12 mt-3'>
                    <p>Preview:</p>

                    <p className='mt-3'>JSON:</p>
                    <pre style={{ background: 'black', color: 'white', padding: '15px', maxHeight: '500px', overflow: 'auto' }}>
                        <code style={{ whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify({ data: editorHtmlValue ?? editorMarkdownValue }, null, 4)}
                        </code>
                    </pre>

                    <p className='mt-3'>JSON (minified):</p>
                    <pre style={{ background: 'black', color: 'white', padding: '15px', maxHeight: '500px', overflow: 'auto' }}>
                        <code style={{ whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify({ data: editorHtmlValue ?? editorMarkdownValue }, null, 0)}
                        </code>
                    </pre>

                    <p className='mt-3'>HTML (dirty): </p>
                    <pre style={{ background: 'black', color: 'white', padding: '15px', maxHeight: '500px', overflow: 'auto' }}>
                        <code style={{ whiteSpace: 'pre-line' }}>
                            {editorHtmlValue ?? editorMarkdownValue}
                        </code>
                    </pre>

                    <p className='mt-3'>HTML (clean): </p>
                    <div className='ql-snow'>
                        <div dangerouslySetInnerHTML={{ __html: SanitizeHTML(editorHtmlValue) }} className='ql-editor' style={{ background: 'black', color: 'white', padding: '15px', maxHeight: '500px', overflow: 'auto', fontFamily: 'inherit' }} />
                    </div>

                    <p className="mt-3">Markdown: </p>
                    <div className="col-12">
                        <textarea defaultValue={editorMarkdownValue} rows={5} className="d-block w-100 mw-100" disabled style={{ background: 'black', color: 'white', padding: '15px', maxHeight: '500px', overflow: 'auto', fontFamily: 'inherit' }} />
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}