export interface Categories {
    categoryId: number;
    name: string;
    slug: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    status: string;
}

export interface CategoriesData {
    totalCount: number;
    page: number;
    pageSize: number;
    data: Categories[];
}