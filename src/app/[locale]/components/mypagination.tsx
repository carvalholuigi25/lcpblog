import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface PaginationProps {
    cid: number;
    pid: number;
    currentPage: number;
    totalPages: number;
}

export default function MyPagination({ cid, pid, currentPage, totalPages }: PaginationProps) {
    const isHiddenNavPagBtns = true;
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(currentPage ?? 1);
    }, [currentPage]);

    const getPageNumbers = () => {
        if(totalPages == 0) return [];

        const pages = [];
        const maxVisiblePages = totalPages >= 10 ? totalPages / 2 : 5;

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);            

        if (page > 3) {
            pages.push("...");
        }

        const startPage = Math.max(2, page - 1);
        const endPage = Math.min(totalPages - 1, page + 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) {
            pages.push("...");
        }

        pages.push(totalPages);

        return pages;
    }

    const createQueryVal = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    const navToPage = (indval: number) => {
        router.push(pathname + (indval > 0 ? "?" + createQueryVal("page", "" + indval) : ""));
    }

    const firstPage = () => {
        const indval = (page - page) + 1;
        setPage(indval);
        navToPage(indval);
    }

    const previousPage = () => {
        const indval = page > 1 ? page - 1 : 1;
        setPage(indval);
        navToPage(indval);
    }

    const itemPage = (index: number) => {
        const indval = index + 1;
        setPage(indval);
        navToPage(indval);
    }

    const nextPage = () => {
        const indval = page < totalPages ? page + 1 : totalPages;
        setPage(indval);
        navToPage(indval);
    }

    const lastPage = () => {
        const indval = totalPages;
        setPage(indval);
        navToPage(indval);
    }

    const getDisabled = (i: number = 1) => {
        return page === i ? "disabled" + (isHiddenNavPagBtns ? " hidden" : "") : "";
    }

    const getIndicators = (direction = "left") => {
        return direction == "left" ? (
            <>
                <li className={`page-item ${getDisabled(1)}`}>
                    <button type="button" className="page-link" onClick={() => firstPage()}>
                        <i className="bi bi-chevron-double-left"></i>
                    </button>
                </li>
                <li className={`page-item ${getDisabled(1)}`}>
                    <button type="button" className="page-link" onClick={() => previousPage()}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                </li>
            </>
        ) : (
            <>
                <li className={`page-item ${getDisabled(totalPages)}`}>
                    <button type="button" className="page-link" onClick={() => nextPage()}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </li>
                <li className={`page-item ${getDisabled(totalPages)}`}>
                    <button type="button" className="page-link" onClick={() => lastPage()}>
                        <i className="bi bi-chevron-double-right"></i>
                    </button>
                </li>
            </>
        );
    }

    return (
        cid >= -1 && pid == -1 && (
            <nav className="d-flex mx-auto text-center">
                <ul className="pagination mt-3 mx-auto">
                    {getIndicators("left")}

                    {getPageNumbers().map((pageNum, index) => (
                        <li key={index} className={`page-item ${pageNum === page ? "active" : ""}`}>
                            {pageNum === "..." ? (
                                <span className="page-link">...</span>
                            ) : (
                                <button type="button" className="page-link" onClick={() => itemPage(index)}>
                                    {pageNum}
                                </button>
                            )}
                        </li>
                    ))}

                    {getIndicators("right")}
                </ul>
            </nav>
        )
    );
}