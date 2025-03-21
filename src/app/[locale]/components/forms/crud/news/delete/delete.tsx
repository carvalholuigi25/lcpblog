/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useRouter } from "next/navigation";
import { Posts } from "@applocale/interfaces/posts";
import { buildMyConnection, sendMessage } from "@applocale/functions/functions";
import {Link} from '@/app/i18n/navigation';
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";

const DeleteNewsForm = ({ id, data }: { id: number, data: Posts }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [loading, setLoading] = useState(true);
    const { push } = useRouter();
    
    useEffect(() => {
        async function deleteMyRealData() {
            const connect = await buildMyConnection("datahub", false);
            setConnection(connect);
        
            try {
                await connect.stop();
                await connect.start();
                console.log("Connection started");
            } catch (e) {
                console.log(e);
            }
        
            connect.on("ReceiveMessage", () => {
                console.log("message deleted");
            });
        
            return () => connect.stop();
        }

        if (logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }

        if(!loading) {
            deleteMyRealData();
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
                url: `api/posts/` + id,
                method: 'delete',
                data: data
            }).then(async (r) => {
                console.log(r);

                setTimeout(async () => {
                    alert("The news post (id: " + id + ") has been deleted sucessfully!");
                    await sendMessage(connection!, r.data);
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
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'} locale={getDefLocale()}>Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">Delete news</h3>
                    <form className={styles.frmdeletenews}>
                        <div className="table-responsive mtable-nobordered mtable-shadow">
                            <table className="table table-nobordered table-rounded table-autolayout">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Title</th>
                                        <th>Category Id</th>
                                        <th>User Id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{data.postId}</td>
                                        <td>{data.title}</td>
                                        <td>{data.categoryId}</td>
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