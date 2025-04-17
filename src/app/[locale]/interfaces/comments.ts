export interface Comments {
    commentId: number;
    content: string;
    status: string;
    userId: number;
    postId: number;
    createdAt?: string;
    updatedAt?: string;
    categoryId: number;
}

export interface CommentsData {
    totalCount: number;
    page: number;
    pageSize: number;
    data: Comments[];
}