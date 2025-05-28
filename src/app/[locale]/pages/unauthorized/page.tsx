import UnauthorizedComponent from "@/app/[locale]/components/ui/unauthcomp";

export default function Unauthorized() {
    return (
        <div className="container p-3 d-flex justify-content-center align-items-center text-center mhv-100">
            <div className="row">
                <div className="col-12 mt-3">
                    <UnauthorizedComponent />
                </div>
            </div>
        </div>
    );
}