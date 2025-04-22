export interface Comments {
    commentId: number;
    content: string;
    status: string;
    userId: number;
    postId: number;
    categoryId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CommentsData {
    totalCount: number;
    page: number;
    pageSize: number;
    data: Comments[];
}