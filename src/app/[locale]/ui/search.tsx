/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useCallback, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMySchemaSearch, type TFormSearchData } from "@applocale/schemas/formSchemas";
import { delFromStorage, saveToStorage } from '@applocale/hooks/localstorage';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import ModalSearch from '@applocale/components/modals/modalsearch';

const Search = () => {
    const t = useTranslations('ui');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        search: ""
    });

    const [showModal, setShowModal] = useState(false);

    const {
        register,
        formState: { isSubmitting },
    } = useForm<TFormSearchData>({
        resolver: zodResolver(useMySchemaSearch()),
    });
 
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
        
            return params.toString();
        },
        [searchParams]
    )

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const doSearchData = (e: any) => {
        e.preventDefault();
        saveToStorage("search", formData.search);
        setShowModal(true);
        router.push(pathname + "?" + createQueryString("search", formData.search));
    }

    const closeModal = () => {
        setShowModal(false);
        delFromStorage("search");
        router.push(pathname + "?" + createQueryString("search", ""));
    }

    return (
        <Suspense>
            <form className="d-flex frmsearch">
                <input
                    {...register("search")}
                    type="text"
                    className="form-control inpsearch me-2"
                    placeholder={t("searchBar") ?? "Search"}
                    aria-label={t("searchBar") ?? "Search"}
                    onChange={handleChange}
                />
                <button 
                    className={"btn btn-tp btnsearch"}
                    type="button" 
                    onClick={doSearchData}
                    disabled={isSubmitting}
                >
                    <i className="bi bi-search"></i>
                </button>
            </form>

            {showModal && <ModalSearch statusModal={showModal} onClose={closeModal} />}
        </Suspense>
    );
}

export default Search;