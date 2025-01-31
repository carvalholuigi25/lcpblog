const ShowAlert = (type = "primary", content = "") => {
    const icotype = type == "danger" ? "exclamation-circle" : type == "warning" ? "exclamation-triangle" : "info-circle";

    return (
        <div className={"alert alert-"+type+" mt-3 mx-auto p-3"} role="alert">
            <i className={"bi bi-"+icotype+" alertico"}></i>
            <span className="alertname">{content}</span>
        </div>
    );
}

export default ShowAlert;