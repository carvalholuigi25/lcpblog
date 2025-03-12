/* eslint-disable @typescript-eslint/no-explicit-any */
import DOMPurify from 'isomorphic-dompurify';

export default function SanitizeHTML(dirtyhtml: any) {
    return DOMPurify.sanitize(dirtyhtml);
}