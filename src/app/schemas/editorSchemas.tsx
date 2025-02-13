import { z } from "zod";

export const myeditorSchema = z.object({
  editorContent: z.string().min(1, "Content is required")
});

export type myEditorSchema = z.infer<typeof myeditorSchema>;
