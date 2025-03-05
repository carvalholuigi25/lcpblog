import styles from "@/app/styles/pagination.module.scss";

export interface PaginationProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ items, pageSize, currentPage, onPageChange }: PaginationProps) => {
    const pagesCount = Math.ceil(items / pageSize);
    if (pagesCount === 0) return null;
    const pages = Array.from({ length: pagesCount-1 }, (_, i) => i + 1);

    return (
        <div className={styles.containerpag}>
            <ul className={styles.pagination}>
                {pages.map((page) => (
                    <li
                        key={page}
                        className={
                            page === currentPage ? styles.pageItemActive : styles.pageItem
                        }
                    >
                        <a className={styles.pageLink} onClick={() => onPageChange(page)}>
                            {page}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Pagination;