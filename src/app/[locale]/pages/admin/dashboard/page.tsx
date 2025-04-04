"use client";
import withAuth from "@applocale/utils/withAuth";
import AdminHomeDashboard from "@applocale/pages/admin/dashboard/home/page";

const AdminDashboard = ({ locale }: { locale?: string }) => {
    return (
        <AdminHomeDashboard locale={locale} />
    )
}

export default withAuth(AdminDashboard, ["admin"]);