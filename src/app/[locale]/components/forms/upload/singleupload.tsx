"use client";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { uploadRules } from "@applocale/utils/uploadrules";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";

export default function FileSingleUploadForm() {
    const router = useRouter();
    const locale = useLocale();
    const [file, setFile] = useState<File | null>(null);
    const [statusState, setStatusState] = useState(false);
    const [status, setStatus] = useState("");
    const [toggleUploadRules, setToggleUploadRules] = useState(false);
    const { pending } = useFormStatus();
    const ref = useRef<HTMLFormElement>(null);
    const isBinary = true;

    const getExtensions = () => {
        return uploadRules.AllowedExtensions.join(", ");
    }

    const getMaxSize = () => {
        return uploadRules.MaxSize;
    }

    const getCalcMaxSize = () => {
        return `${(getMaxSize() / (isBinary ? 1000*1000 : 1024*1024)).toFixed(2)} mb`;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const clearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
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
            setStatus("Please select a file first.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await FetchDataAxios({
                url: "api/files/upload/single",
                method: "POST",
                data: formData,
                headers: {
                    "Accept": "multipart/form-data, application/json, application/octet-stream; charset=utf-8",
                    "Content-Type": "multipart/form-data, application/json, application/octet-stream; charset=utf-8",
                }
            });

            if (response && response.status === 200) {
                setStatusState(true);
                setStatus("File uploaded successfully!");
                ref.current?.reset();
                router.push("/");
            } else {
                setStatusState(false);
                setStatus("Upload failed.");
                ref.current?.reset();
            }
        } catch (error) {
            setStatusState(false);
            setStatus("Error uploading file. Message: " + error);
            ref.current?.reset();
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="mt-3">
                    <button className="btn btn-primary btntoggleuplrules" onClick={() => setToggleUploadRules(!toggleUploadRules)}>
                        {!!toggleUploadRules ? "Hide" : "Show"} upload rules
                    </button>

                    {!!toggleUploadRules && uploadRules && (
                        <div className="mt-3 uplrulesblk">
                            <fieldset className="uplrulesubblk">
                                <legend className="uplrulestitle">Upload rules</legend>
                                <p className="mt-3">Allowed extensions: {getExtensions()}</p>
                                <p className="mt-3">Max Size: {getMaxSize()} bytes ({getCalcMaxSize()})</p>
                            </fieldset>
                        </div>
                    )}
                </div>

                <form ref={ref} className="frmuplfilesingle mt-3" encType="multipart/form-data" onSubmit={handleUpload}>
                    <div className="form-group">
                        <input type="file" name="file" onChange={handleFileChange} />
                    </div>
                    <div className="form-group mx-auto">
                        <p>{status}</p>

                        <button 
                            type="reset" 
                            className="btn btn-secondary btn-reset mt-3" 
                            disabled={pending || !file && !statusState} 
                            onClick={clearForm}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary btn-upload mt-3 ms-3"
                            disabled={pending || !file && !statusState}
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
