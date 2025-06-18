export interface Posts {
    postId: number;
    title: string;
    content: string;
    image: string;
    slug: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    views?: number;
    viewsCounter?: number;
    status: string;
    isFeatured?: boolean;
    categoryId: number;
    userId: number;
    tags?: string[];
}

export interface PostsData {
    totalCount: number;
    page: number;
    pageSize: number;
    data: Posts[];
}

export interface PostsViews {
    postId: number;
    viewsCounter: number;
    views: number;
}