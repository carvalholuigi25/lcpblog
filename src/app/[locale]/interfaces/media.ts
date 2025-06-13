export interface Media {
    mediaId?: number;
    typeUrl: string;
    src: string;
    typeMime: string;
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