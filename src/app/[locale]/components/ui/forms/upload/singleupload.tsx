"use client";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { uploadRules } from "@applocale/utils/uploadrules";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";

export default function FileSingleUploadForm() {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("pages.AdminPages.MediaPage");
    const [file, setFile] = useState<File | null>(null);
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

    const getExtensions = () => {
        return uploadRules.AllowedExtensions.join(", ");
    }

    const getMaxSize = () => {
        return uploadRules.MaxSize;
    }

    const getCalcMaxSize = () => {
        return `${(getMaxSize() / (isBinary ? 1000 * 1000 : 1024 * 1024)).toFixed(2)}`;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setProgress(0);
        }
    };

    const clearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setProgress(0);
        setProgressShown(false);
        setFile(null);
        setStatus("");
        setStatusState(false);
        ref.current?.reset();
        router.push(`/${locale}/pages/admin/dashboard/media`);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpload = async (e: any) => {
        e.preventDefault();

        if (!file) {
            setStatus(t('messages.nofile') ?? "Please select a file first.");
            return;
        }

        try {
            setProgressShown(true);

            const formData = new FormData();
            formData.append("file", file);

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
                setStatus(t('messages.uploadsuccess') ?? "File uploaded successfully!");
                ref.current?.reset();
                router.push(`/${locale}/pages/admin/dashboard`);
            } else {
                setStatusState(false);
                setStatus(t('messages.uploadfailed') ?? "File upload failed!");
                ref.current?.reset();
            }
        } catch (error) {
            setStatusState(false);
            setStatus(t('messages.uploaderror', {message: ""+error}) ?? `Error uploading file. Message: ${error}`);
            ref.current?.reset();
        }
    };

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

                <form ref={ref} className="frmuplfilesingle mt-3" encType="multipart/form-data" onSubmit={handleUpload}>
                    <div className="form-group">
                        <input type="file" name="file" onChange={handleFileChange} />
                    </div>
                    <div className="form-group mx-auto">
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
