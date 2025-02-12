/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@/app/page.module.scss";
import { useEffect, useState } from "react";
import { getFromStorage } from "@/app/hooks/localstorage";
import { useRouter } from "next/navigation";
import { Posts } from "@/app/interfaces/posts";
import Link from "next/link";
import FetchDataAxios from "@/app/utils/fetchdataaxios";

const DeleteNewsForm = ({id, data}: {id: number, data: Posts}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const { push } = useRouter();

    useEffect(() => {
        if(logInfo) {
            setIsLoggedIn(true);
        }
    }, [logInfo]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await FetchDataAxios({
                url: `api/posts/`+id,
                method: 'delete',
                data: data
            }).then((r) => {
                console.log(r);

                setTimeout(() => {
                    alert("The news post (id: "+id+") has been deleted sucessfully!");
                    push("/");
                }, 1000 / 2);
            }).catch((err) => {
                console.error(err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleBack = (e: any) => {
        e.preventDefault();
        push("/");
    }

    return (
        <div className="container">
            {!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto p-3" style={{marginTop: '3rem'}}>
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="bi bi-exclamation-triangle mx-auto" style={{fontSize: '4rem'}} />
                                <p className="mt-3">You are not authorized to see this page!</p>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'}>Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">Delete news</h3>
                    <form className={styles.frmdeletenews}>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Title</th>
                                        <th>User Id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{data.postId}</td>
                                        <td>{data.title}</td>
                                        <td>{data.userId}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="text-center mx-auto mt-3">Do you want to delete this post (id: {data.postId})?</p>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-primary btndel btn-rounded ms-3" type="button" onClick={handleSubmit}>Yes</button>
                            <button className="btn btn-secondary btnback btn-rounded ms-3" type="button" onClick={handleBack}>No</button>
                        </div>
                    </form>
                </>
            )}  
        </div>
    );
}

export default DeleteNewsForm;