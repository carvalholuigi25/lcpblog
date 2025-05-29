/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMySchemaSearch, type TFormSearchData } from "@applocale/schemas/formSchemas";
import { delFromStorage, saveToStorage } from '@applocale/hooks/localstorage';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import ModalSearch from '@applocale/components/ui/modals/modalsearch';
import LoadingComp from '@applocale/components/ui/loadingcomp';

const Search = () => {
    const t = useTranslations('ui.searchBar');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        search: ""
    });

    const {
        register,
        setValue,
        getValues,
        reset
    } = useForm<TFormSearchData>({
        resolver: zodResolver(useMySchemaSearch()),
    });

    useEffect(() => {
        reset(formData);
    }, [reset, formData]);

    const getSearchVal = () => {
        return getValues("search") ?? formData.search;
    };

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

        if (getSearchVal().length == 0) {
            alert(t("lblsearchempty") ?? "Please search something...");
            return false;
        }

        setShowModal(true);
        saveToStorage("search", getSearchVal());
        router.replace(pathname + "?" + createQueryString("search", getSearchVal()));
    }

    const closeModal = () => {
        setShowModal(false);
        delFromStorage("search");
        setValue("search", "");
        router.replace(pathname + "?" + createQueryString("search", ""));
    }

    const icoSearch = () => {
        return (showModal && getSearchVal().length > 0 ? "bi-x-lg" : "bi-search");
    }

    const loadingIco = () => <LoadingComp type="icon" icontype="ring" /> 

    return (
        <Suspense fallback={loadingIco()}>
            <form className="d-flex frmsearch">
                <input
                    {...register("search")}
                    type="text"
                    className="form-control inpsearch"
                    placeholder={t("title") ?? "Search"}
                    aria-label={t("title") ?? "Search"}
                    onChange={handleChange}
                />
                <button
                    type="button"
                    className={"btn btn-tp btnsearch"}
                    onClick={doSearchData}
                >
                    <i className={`bi ${icoSearch()}`}></i>
                </button>
            </form>

            {showModal && <ModalSearch statusModal={showModal} onClose={closeModal} />}
        </Suspense>
    );
}

export default Search;