// sources: https://lexical.dev/docs/getting-started/react, https://stackblitz.com/edit/facebook-lexical-3mwbtyri
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { myEditorSchema, myeditorSchema } from '@/app/schemas/editorSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { MyLexicalEditor } from './mylexicaleditor';
import ExampleTheme from './ExampleTheme';

export default function MyEditor() {
    const { control } = useForm<myEditorSchema>({
        resolver: zodResolver(myeditorSchema),
        defaultValues: { editorContent: "" },
    });

    const initialConfig = {
        namespace: 'MyEditor',
        theme: ExampleTheme(),
        onError: console.error
    };

    return (
        <div className={"myeditorblk"}>
            <div className="container-fluid">
                <LexicalComposer initialConfig={initialConfig}>
                    <Controller
                        name="editorContent"
                        control={control}
                        render={({ field }: {field: ControllerRenderProps<any>}) => (
                            <MyLexicalEditor field={field} typeContent="all" previewContent={true} />
                        )}
                    />
                </LexicalComposer>
            </div>
        </div>
    );
}