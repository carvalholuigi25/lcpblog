// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const paginate = (items: any, pageNumber: number, pageSize: number) => {
    const startIndex = (pageNumber - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
};