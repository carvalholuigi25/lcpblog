export interface Posts {
    postId: number;
    title: string;
    content: string;
    image: string;
    slug: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    status: string;
    userId: number;
}

export interface PostsData {
    totalCount: number;
    page: number;
    pageSize: number;
    data: Posts[];
}