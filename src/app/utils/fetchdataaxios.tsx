/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import { getFromStorage } from "@/app/hooks/localstorage";

export interface CTAxiosInterface {
    url: string;
    method: string;
    data?: any;
    headers?: any;
    reqAuthorize?: boolean;
}

export function getHeadersAxios(isReqAuthorize: boolean = false): any {
    return {
        "Authorization": !!isReqAuthorize && getFromStorage("logInfo") ? `Bearer ${JSON.parse(getFromStorage("logInfo")!)[0].jwtToken}` : ""
    }
}

export function getConfigAxios(ctaxint: CTAxiosInterface): AxiosRequestConfig<any> {
    return {
        url: `${process.env.apiURL}/${ctaxint.url}`,
        method: ctaxint.method,
        data: !["get", "head"].includes(ctaxint.method) ? ctaxint.data : null,
        headers: getHeadersAxios(ctaxint.reqAuthorize)
    };
}

export async function FetchMultipleDataAxios(ctaxint: CTAxiosInterface[]): Promise<any[]> {
    const promises = ctaxint.map(async (item: CTAxiosInterface) => {
        const config = getConfigAxios(item);
        const res = await axios(config);
        return res;
    });

    return Promise.all(promises);
}

export default async function FetchDataAxios(ctaxint: CTAxiosInterface) {
    const config = getConfigAxios(ctaxint);
    const res = await axios(config);
    return res;
}