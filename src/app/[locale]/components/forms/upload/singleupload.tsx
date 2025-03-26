"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";

export default function FileSingleUploadForm() {
    const [file, setFile] = useState<File | null>(null);
    const [statusState, setStatusState] = useState(false);
    const [status, setStatus] = useState("");
    const { pending } = useFormStatus();
    const ref = useRef<HTMLFormElement>(null);
    const router = useRouter();

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
        router.push("/pt-PT/pages/admin/dashboard/media");
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
                    "Accept": "multipart/form-data, application/json; charset=utf-8",
                    "Content-Type": "multipart/form-data, application/json; charset=utf-8",
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
                <form ref={ref} className="frmuplfilesingle" encType="multipart/form-data" onSubmit={handleUpload}>
                    <div className="form-group">
                        <input type="file" name="file" onChange={handleFileChange} />
                    </div>
                    <div className="form-group mx-auto">
                        <p>{status}</p>
                        <button type="reset" className="btn btn-secondary btn-reset mt-3" disabled={!file && !statusState} onClick={clearForm}>Reset</button>
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
