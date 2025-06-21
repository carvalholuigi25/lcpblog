// middlewares/withMyHeaders.ts
import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CustomMiddleware } from './chain';
import { getDefLocale } from '@/app/[locale]/helpers/defLocale';

export function withMyHeaders(middleware: CustomMiddleware) {
    return async (
        request: NextRequest,
        event: NextFetchEvent
    ) => {
        const reqHeaders = new Headers(request.headers)

        reqHeaders.set("x-current-path", request.nextUrl.pathname);
        reqHeaders.set("x-current-href", request.nextUrl.href);
        reqHeaders.set("x-current-lang", request.nextUrl.pathname.split("/")[1] ?? getDefLocale());

        const response = NextResponse.next({
            request: {
                headers: reqHeaders,
            },
        });

        return middleware(request, event, response);
    };
}