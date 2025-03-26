"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import { useFormStatus } from "react-dom";

export default function FileMultiUploadForm() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [statusState, setStatusState] = useState(false);
    const [status, setStatus] = useState("");
    const { pending } = useFormStatus();
    const ref = useRef<HTMLFormElement>(null);
    const router = useRouter();
    
    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const clearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFiles(null);
        setStatus("");
        setStatusState(false);
        ref.current?.reset();
        router.push("/pt-PT/pages/admin/dashboard/media");
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
                    "Accept": "multipart/form-data, application/json; charset=utf-8",
                    "Content-Type": "multipart/form-data, application/json; charset=utf-8",
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
                <form ref={ref} className="frmuplfilesmult" encType="multipart/form-data" onSubmit={handleUpload}>
                    <div className="form-group">
                        <input type="file" name="file" multiple onChange={handleFilesChange} />
                    </div>
                    <div className="form-group mx-auto">
                        <p>{status}</p>
                        <button type="reset" className="btn btn-secondary btn-reset mt-3" disabled={!files && !statusState} onClick={clearForm}>Reset</button>
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
