export interface Tags {
    tagId: number;
    name: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    status: string;
}

export interface TagsData {
    totalCount: number;
    page: number;
    pageSize: number;
    data: Tags[];
}