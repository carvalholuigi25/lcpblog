/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { TFormSearchData, fsearchSchema } from "@/app/schemas/formSchemas";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { delFromStorage, saveToStorage } from '@/app/hooks/localstorage';
import ModalSearch from '../modals/modalsearch';

const Search = () => {
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
        resolver: zodResolver(fsearchSchema),
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
        <>
            <form className="d-flex frmsearch">
                <input
                    {...register("search")}
                    type="text"
                    className="form-control inpsearch me-2"
                    placeholder="Search"
                    aria-label="Search"
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
        </>
    );
}

export default Search;