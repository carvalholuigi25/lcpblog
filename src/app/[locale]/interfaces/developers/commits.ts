export interface CommitsAuthors {
    name: string;
    email: string;
    date?: string;
}

export interface Committer {
    name: string;
    email: string;
    date?: string;
}

export interface CommitTree {
    tree: string;
    url: string;
}

export interface CommitVerification {
    verified: boolean;
    reason: string;
    signature: string[];
    payload: string[];
    verified_at: string[];
}

export interface Commits {
    author: CommitsAuthors[];
    committer?: Committer[];
    tree?: CommitTree[];
    verification?: CommitVerification[];
    message?: string;
    url?: string;
    commit_count?: number;
}