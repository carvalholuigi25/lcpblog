"use client";
import Image from 'next/image';
import { useRef, useCallback, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { uploadRules } from "@applocale/utils/uploadrules";
import { getFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";

export default function FileDragDropUploadForm() {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("pages.AdminPages.MediaPage");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [statusState, setStatusState] = useState(false);
    const [status, setStatus] = useState("");
    const [toggleUploadRules, setToggleUploadRules] = useState(false);
    const [progressShown, setProgressShown] = useState(false);
    const [progress, setProgress] = useState(0);
    const { pending } = useFormStatus();
    const ref = useRef<HTMLFormElement>(null);
    const isBinary = true;
        
    useEffect(() => {
        setToggleUploadRules(getFromStorage("showUploadRules")! == "true" ? true : false);
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        setFile(file);
        setPreview(URL.createObjectURL(file));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const getExtensions = () => {
        return uploadRules.AllowedExtensions.join(", ");
    }

    const getMaxSize = () => {
        return uploadRules.MaxSize;
    }

    const getCalcMaxSize = () => {
        return `${(getMaxSize() / (isBinary ? 1000 * 1000 : 1024 * 1024)).toFixed(2)}`;
    }

    const clearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPreview(null);
        setFile(null);
        setStatus("");
        setStatusState(false);
        ref.current?.reset();
        router.push(`/${locale}/pages/admin/dashboard/media`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpload = async (e: any) => {
        e.preventDefault();
        if (!file) {
            setStatus(t('messages.nofile') ?? "Please select at least one file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setProgressShown(true);

            const response = await FetchDataAxios({
                url: "api/files/upload/single",
                method: "POST",
                data: formData,
                headers: {
                    "Accept": "multipart/form-data, application/json, application/octet-stream; charset=utf-8",
                    "Content-Type": "multipart/form-data, application/json, application/octet-stream; charset=utf-8",
                },
                onUploadProgress: (event) => {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    setProgress(percentCompleted);
                },
            });

            if (response && response.status === 200) {
                setStatusState(true);
                setStatus(t('messages.uploadsuccess') ?? "File uploaded successfully.");
                ref.current?.reset();
                router.push(`/${locale}/pages/admin/dashboard`);
            } else {
                setStatusState(false);
                setStatus(t('messages.uploadfailed') ?? "File upload failed.");
                ref.current?.reset();
            }
        } catch (error) {
            setStatusState(false);
            setStatus(t('messages.uploaderror', {message: ""+error}) ?? `Error uploading file. Message: ${error}`);
            ref.current?.reset();
        }
    }
    
    const changeToggleUploadRules = () => {
        saveToStorage("showUploadRules", !toggleUploadRules);
        setToggleUploadRules(!toggleUploadRules);
    }

    return (
        <div className={"container-fluid"}>
            <div className="row">
                <div className="mt-3">
                    <button className="btn btn-primary btntoggleuplrules" onClick={changeToggleUploadRules}>
                        {!!toggleUploadRules ? (t('btnshowuploadrules.hide') ?? "Hide") : (t('btnshowuploadrules.show') ?? "Show")} {t('btnshowuploadrules.title') ?? "Upload Rules"}
                    </button>

                    {!!toggleUploadRules && uploadRules && (
                        <div className="mt-3 uplrulesblk">
                            <fieldset className="uplrulesubblk">
                                <legend className="uplrulestitle">{t('uploadrules.title') ?? "Upload rules"}</legend>
                                <p className="mt-3">
                                    {t('uploadrules.rules.allowedextensions', {extensions: getExtensions()}) ?? `Allowed extensions: ${getExtensions()}`}
                                </p>
                                <p className="mt-3">
                                    {t('uploadrules.rules.maxallowedsize', {sizeInBytes: getMaxSize(), sizeInMB: getCalcMaxSize()}) ?? `Max Size: ${getMaxSize()} bytes (${getCalcMaxSize()})`}
                                </p>
                            </fieldset>
                        </div>
                    )}
                </div>

                <form ref={ref} className="frmuplfilesmult mt-3" encType="multipart/form-data" onSubmit={handleUpload}>
                    <div className="form-group">
                        <div
                            {...getRootProps()}
                            className={`myuplborder ${isDragActive ? "myuplborderact" : "myuplborderinact"}`}
                        >
                            <input {...getInputProps()} />
                            <i className="bi bi-cloud-plus-fill"></i>

                            {isDragActive ? (
                                <p>{t('messages.drop') ?? "Drop the file here..."}</p>
                            ) : (
                                <p>{t('messages.dragndrop') ?? "Drag and drop a file here, or click to select file"}</p>
                            )}
                        </div>

                        <div className="row">
                            {preview && (
                                <div className="col-12">
                                    <div className="card mt-3">
                                        <div className="card-body">
                                            <h4>{t('preview.title') ?? "Preview"}</h4>
                                            <Image src={preview} alt={"preview"} className="img-fluid" width={400} height={400} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {file && (
                        <div className="form-group mx-auto mt-3">
                            <button
                                type="reset"
                                className="btn btn-secondary btn-reset mt-3"
                                disabled={pending || !file && !statusState}
                                onClick={clearForm}
                            >
                                {t('uploadact.btnreset') ?? "Reset"}
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary btn-upload mt-3 ms-3"
                                disabled={pending || !file && !statusState}
                            >
                                {t('uploadact.btnupload') ?? "Upload"}
                            </button>
                        </div>
                    )}
                </form>

                {!!progressShown && progress > 0 && (
                    <div className="w-full rounded mt-3">
                        <div className="progress" role="progressbar" aria-label="Upload progress bar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                            <div className="progress-bar progress-bar-striped progress-bar-animated p-3" style={{ width: progress + "%" }}>
                                {progress}%
                            </div>
                        </div>
                    </div>
                )}

                <p className="mt-3">{status}</p>
            </div>
        </div>
    );
}
