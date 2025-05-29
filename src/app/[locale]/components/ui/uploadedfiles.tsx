/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FilesMetadata } from "@applocale/interfaces/filesmetadata";
import { getImagePath } from "@applocale/functions/functions";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/ui/loadingcomp";

export default function UploadedFiles() {
    const t = useTranslations("pages.AdminPages.MediaPage");
    const [loading, setLoading] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await FetchDataAxios({
                url: "api/files/list",
                method: "GET"
            });

            setUploadedFiles(response.data);
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="loadingbar">
                <LoadingComp type="icon" icontype="ring" />
            </div>
        );
    }

    return (
        <div className="myuploadedfiles mt-3">
            <div className="row mt-3">
                {!uploadedFiles || uploadedFiles.length == 0 && (
                    <div className="col-12">
                        <p>{t('results.nofilesuploaded') ?? "No files uploaded yet."}</p>
                    </div>
                )}

                {!!uploadedFiles && uploadedFiles.map((file: FilesMetadata, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
                        <Link href={"https://localhost:5000/uploads/" + file.fileName} target="_blank" rel="noreferrer">
                            <div className="card">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="d-inline-block"
                                >
                                    <Image
                                        src={getImagePath(file.fileName, "uploads")}
                                        width="400"
                                        height="400"
                                        alt="News image"
                                        className={"myuplfileimg img-fluid"}
                                        onError={(event: any) => {
                                            event.target.id = "/images/notfound.jpg";
                                            event.target.srcset = "/images/notfound.jpg";
                                        }}
                                        priority
                                    />
                                </motion.div>

                                <div className="card-body">
                                    <h5 className="card-title">{file.fileName}</h5>
                                    <p className="card-text">
                                        {t('results.contentType') ?? "Content type"}: {file.contentType}
                                    </p>
                                    <p className="card-text">
                                        {t('results.uploadedDate') ?? "Date of upload"}: {file.uploadedAt}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}