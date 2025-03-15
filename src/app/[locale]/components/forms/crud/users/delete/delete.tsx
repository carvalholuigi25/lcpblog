/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useRouter } from "next/navigation";
import { User } from "@applocale/interfaces/user";
import { Link } from '@/app/i18n/navigation';
import FetchDataAxios from "@applocale/utils/fetchdataaxios";

const DeleteUsersForm = ({ id, data }: { id: number, data: User }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [loading, setLoading] = useState(true);
    const { push } = useRouter();
    
    useEffect(() => {
        if (logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }
    }, [logInfo, loading]);

    if (loading) {
        return (
            <div className='container'>
                <div className='row justify-content-center align-items-center p-3'>
                    <div className='col-12 card p-3 text-center'>
                        <div className='card-body'>
                            <i className="bi-clock" style={{ fontSize: "4rem" }}></i>
                            <p>Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await FetchDataAxios({
                url: `api/users/` + id,
                method: 'delete',
                data: data,
                reqAuthorize: true,
            }).then(async (r) => {
                console.log(r);

                setTimeout(async () => {
                    alert("The users (id: " + id + ") has been deleted sucessfully!");
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
                    <div className="col-12 mx-auto p-3" style={{ marginTop: '3rem' }}>
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="bi bi-exclamation-triangle mx-auto" style={{ fontSize: '4rem' }} />
                                <p className="mt-3">You are not authorized to see this page!</p>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'}>Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">Delete users</h3>
                    <form className={styles.frmdeleteusers}>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Display Name</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{data.userId}</td>
                                        <td>{data.username}</td>
                                        <td>{data.email}</td>
                                        <td>{data.displayName}</td>
                                        <td>{data.role}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="text-center mx-auto mt-3">Do you want to delete this user (id: {data.userId})?</p>

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

export default DeleteUsersForm;