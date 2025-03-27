"use client";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { uploadRules } from "@applocale/utils/uploadrules";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";

export default function FileMultiUploadForm() {
    const router = useRouter();
    const locale = useLocale();
    const [files, setFiles] = useState<FileList | null>(null);
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
    
    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const clearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFiles(null);
        setStatus("");
        setStatusState(false);
        ref.current?.reset();
        router.push(`/${locale}/pages/admin/dashboard/media`);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpload = async (e: any) => {
        e.preventDefault();

        if (!files || files.length === 0) {
            setStatus("Please select at least one file.");
            return;
        }

        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await FetchDataAxios({
                url: "api/files/upload/multiple",
                method: "POST",
                data: formData,
                headers: {
                    "Accept": "multipart/form-data, application/json, application/octet-stream; charset=utf-8",
                    "Content-Type": "multipart/form-data, application/json, application/octet-stream; charset=utf-8",
                }
            });

            if (response && response.status === 200) {
                setStatusState(true);
                setStatus("File(s) uploaded successfully!");
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

                <form ref={ref} className="frmuplfilesmult mt-3" encType="multipart/form-data" onSubmit={handleUpload}>
                    <div className="form-group">
                        <input type="file" name="file" multiple onChange={handleFilesChange} />
                    </div>
                    <div className="form-group mx-auto">
                        <p>{status}</p>

                        <button 
                            type="reset" 
                            className="btn btn-secondary btn-reset mt-3" 
                            disabled={pending || !files && !statusState} 
                            onClick={clearForm}
                        >
                            Reset
                        </button>
                        
                        <button
                            type="submit"
                            className="btn btn-primary btn-upload mt-3 ms-3"
                            disabled={pending || !files && !statusState}
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
