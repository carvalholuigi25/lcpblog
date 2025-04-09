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

/*

"author": {
        "name": "Luigi Carvalho",
        "email": "carvalholuigi25@gmail.com",
        "date": "2025-04-09T10:22:40Z"
    },
    "committer": {
        "name": "Luigi Carvalho",
        "email": "carvalholuigi25@gmail.com",
        "date": "2025-04-09T10:22:40Z"
    },
    "message": "feat(schedule): implement modal for schedule details and enhance calendar interactions",
    "tree": {
        "sha": "910927f2afe5280d84b1964ef02f104b54b666e4",
        "url": "https://api.github.com/repos/carvalholuigi25/lcpblog/git/trees/910927f2afe5280d84b1964ef02f104b54b666e4"
    },
    "url": "https://api.github.com/repos/carvalholuigi25/lcpblog/git/commits/f034a01784a22a66880ca7b4a3f3223b778a8f3b",
    "comment_count": 0,
    "verification": {
        "verified": false,
        "reason": "unsigned",
        "signature": null,
        "payload": null,
        "verified_at": null
    }*/