import Link from "next/link";

export default function UnauthorizedComponent() {
    return (
        <div className="card mx-auto">
            <div className="card-body text-center">
                <i className="bi bi-exclamation-triangle" style={{ fontSize: "4rem" }} />
                <h3>Warning</h3>
                <p>You are not authorized to view this page!</p>
                <Link href={'/'} className="btn btn-primary btn-rounded btnback mt-3">Back</Link>
            </div>
        </div>
    );
}