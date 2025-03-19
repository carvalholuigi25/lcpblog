import UnauthorizedComponent from "@applocale/components/unauthcomp";

export default function Unauthorized() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-12 mt-3">
                    <UnauthorizedComponent />
                </div>
            </div>
        </div>
    );
}