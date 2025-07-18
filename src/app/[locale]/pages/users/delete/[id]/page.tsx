/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { use, useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { User } from "@applocale/interfaces/user";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { Link } from '@/app/i18n/navigation';
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import DeleteUsersForm from "@applocale/components/ui/forms/crud/users/delete/delete";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/ui/loadingcomp";

export default function DeleteUsers({ params }: { params: any }) {
  const {locale}: any = use(params);
  const { id } = useParams();
  const [users, setUsers] = useState(null as unknown as User);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUsers() {
      const ndata = await FetchDataAxios({
        url: 'api/users/' + id,
        method: 'get',
        reqAuthorize:  process.env.NODE_ENV === "production" ? true : false
      });

      const usersdata = ndata.data ?? ndata;
      setUsers(JSON.parse(JSON.stringify(usersdata)));
      setLoading(false);
    }
    fetchUsers()
  }, [id, loading]);

  if (loading) {
    return (
      <LoadingComp type="icon" icontype="ring" />
    );
  }

  const getEmptyUsers = (pathname: any): any => {
    return (
      <div className='col-12'>
        <div className="card p-3 text-center">
          <div className='card-body'>
            <i className="bi-exclamation-triangle" style={{ fontSize: "4rem" }}></i>
            <p>0 users</p>
            {pathname !== "/" && (
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>Back</Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getBackLink = (pathname: any): any => {
    return (
      <div className="col-12 mt-3 mx-auto text-center">
        <Link href={pathname !== "/pages/users" ? "/pages/users" : "/"} className="btn btn-primary btn-rounded mt-3 mx-auto d-inline-block" locale={locale ?? getDefLocale()}>
          Back
        </Link>
      </div>
    );
  };

  return (
    <div className={"npage " + styles.page} id="deleteusersmpage">
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        {!users && getEmptyUsers(pathname)}

        {!!users && (
          <>
            <DeleteUsersForm id={parseInt("" + id, 0)} data={users} />
          </>
        )}

        {pathname !== "/" && getBackLink(pathname)}
      </section>
      <Footer />
    </div>
  );
}