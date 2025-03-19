import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@applocale/hooks/useAuth";
import { UserRole } from "@applocale/interfaces/user";
import { getDefLocale } from "@applocale/helpers/defLocale";

const withAuth = (WrappedComponent: React.ComponentType, allowedRoles: UserRole[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Wrapper = (props: any) => {
    const { role } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (role !== undefined && (!role || !allowedRoles.includes(role!))) {
            router.push("/" + getDefLocale() + "/pages/unauthorized");
        }
    }, [role, router]);

    if (role !== undefined && (!role || !allowedRoles.includes(role!))) return null;

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
