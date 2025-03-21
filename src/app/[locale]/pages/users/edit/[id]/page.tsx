/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import styles from "@applocale/page.module.scss";
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import EditUsersForm from "@applocale/components/forms/crud/users/edit/edit";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { User } from "@applocale/interfaces/user";
import { Link } from '@/app/i18n/navigation';
import { useLocale } from "next-intl";

export default function EditUsers() {
  const locale = useLocale();
  const { id } = useParams();
  const [users, setUsers] = useState(null as unknown as User);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUsers() {
      const ndata = await FetchDataAxios({
        url: 'api/users/' + id,
        method: 'get',
        reqAuthorize: false
      });

      const usersdata = ndata.data ?? ndata;
      setUsers(JSON.parse(JSON.stringify(usersdata)));
      setLoading(false);
    }
    fetchUsers()
  }, [id, loading]);

  if (loading) {
    return (
      <div className='container'>
        <div className='row justify-content-center align-items-center p-3'>
          <div className='col-12 card p-3 text-center'>
            <div className='card-body'>
              <i className="bi-clock" style={{ fontSize: "4rem" }}></i>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
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
    <div className={styles.page} id="editusersmpage" style={{ paddingTop: '5rem' }}>
      <Header locale={locale ?? getDefLocale()} />
      <section className={styles.section + " " + styles.pstretch}>
        {!users && getEmptyUsers(pathname)}

        {!!users && (
          <EditUsersForm id={parseInt("" + id, 0)} data={users} />
        )}

        {pathname !== "/" && pathname !== "/" + getDefLocale() + "/pages/users/edit/"+id && getBackLink(pathname)}
      </section>
      <Footer />
    </div>
  );
}