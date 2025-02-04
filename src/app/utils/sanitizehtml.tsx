/* eslint-disable @typescript-eslint/no-explicit-any */
import DOMPurify from 'dompurify';

export default function SanitizeHTML(dirtyhtml: any) {
    return DOMPurify.sanitize(dirtyhtml);
}