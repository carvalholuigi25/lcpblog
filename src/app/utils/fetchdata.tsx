/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFromStorage } from "@/app/hooks/localstorage";

export interface CTInterface {
    url: string;
    method: string;
    data?: any;
    headers?: any;
    reqAuthorize?: boolean;
}

export function getHeaders(isReqAuthorize: boolean = false): any {
    return {
        "Authorization": !!isReqAuthorize && getFromStorage("logInfo") ? `Bearer ${JSON.parse(getFromStorage("logInfo")!)[0].jwtToken}` : ""
    }
}

export function getConfig(ctint: CTInterface): RequestInit {
    return {
        method: ctint.method,
        mode: 'cors',
        body: !['get', 'head'].includes(ctint.method) ? JSON.stringify(ctint.data) : null,
        headers: getHeaders(ctint.reqAuthorize),
        cache: 'no-store'
    };
}

export async function FetchMultipleData(ctint: CTInterface[]): Promise<any[]> {
    const promises = ctint.map(async (item: CTInterface) => {
        const config: RequestInit = getConfig(item);
        const res = await fetch(`${process.env.apiURL}/${item.url}`, config);
        return res.json();
    });

    return Promise.all(promises);
}

export default async function FetchData(ctint: CTInterface) {
    const config: RequestInit = getConfig(ctint);
    const res = await fetch(`${process.env.apiURL}/${ctint.url}`, config);
    return res.json();
}