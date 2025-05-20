/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import { getFromStorage } from "@applocale/hooks/localstorage";
import https from 'https';

export interface CTAxiosInterface {
    url: string;
    method: string;
    data?: any;
    headers?: any;
    reqAuthorize?: boolean;
    onUploadProgress?: (progressEvent: any) => void;
}

export function getHeadersAxios(isReqAuthorize: boolean = false, methodReq: string = "get", enableCacheNoStore: boolean = false): any {
    return {
        "Authorization": !!isReqAuthorize && getFromStorage("logInfo") ? `Bearer ${JSON.parse(getFromStorage("logInfo")!)[0].jwtToken}` : "",
        "Cache-Control": !!enableCacheNoStore && !["get", "post", "put", "delete"].includes(methodReq) ? "no-cache, no-store, must-revalidate" : "",
        "Pragma": !!enableCacheNoStore && !["get", "post", "put", "delete"].includes(methodReq) ? "no-cache" : "",
        "Expires": !!enableCacheNoStore && !["get", "post", "put", "delete"].includes(methodReq) ? "0" : ""
    }
}

export function getConfigAxios(ctaxint: CTAxiosInterface): AxiosRequestConfig<any> {
    return {
        url: `${process.env.apiURL}/${ctaxint.url}`,
        method: ctaxint.method,
        data: !["get", "head"].includes(ctaxint.method) ? ctaxint.data : null,
        headers: getHeadersAxios(ctaxint.reqAuthorize, ctaxint.method, true),
        params: {
            timestamp: Date.now()
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
        onUploadProgress: ctaxint.onUploadProgress
    };
}

export async function FetchMultipleDataAxios(ctaxint: CTAxiosInterface[]): Promise<any[]> {
    const promises = ctaxint.map(async (item: CTAxiosInterface) => {
        const config = getConfigAxios(item);
        const res = await axios(config);
        return res.data;
    });

    return Promise.all(promises);
}

export default async function FetchDataAxios(ctaxint: CTAxiosInterface) {
    const config = getConfigAxios(ctaxint);
    const res = await axios(config);
    return res;
}