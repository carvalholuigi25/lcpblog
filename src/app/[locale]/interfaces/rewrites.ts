export interface Rewrites {
    id: number;
    locale: string;
    rules: RewritesRules[];
}

export interface RewritesRules {
    source: string;
    destination: string;
}