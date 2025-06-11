export interface Media {
    mediaId?: number;
    src: string;
    type: string;
    thumbnail?: string;
    title?: string;
    description?: string;
    privacy?: string;
    isFeatured?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categoryId?: number;
    userId?: number;
}