"use client";
import styles from "@applocale/page.module.scss";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/app/i18n/navigation';
import { User } from '@applocale/interfaces/user';
import { getDefLocale } from "@applocale/helpers/defLocale";
import { useLocale, useTranslations } from "next-intl";
import FetchData from '@applocale/utils/fetchdata';
import Header from "@applocale/ui/header";
import Footer from "@applocale/ui/footer";
import LoadingComp from "@applocale/components/loadingcomp";

export default function UserPage() {
  const t = useTranslations("pages.UsersPage");
  
  const locale = useLocale();
  const { id } = useParams();
  const [users, setUsers] = useState(null as unknown as User);

  useEffect(() => {
    async function fetchUsers() {
      const idq = id !== "" ? "/" + parseInt(""+id, 0) : "/";
      const data = await FetchData({
        url: `api/users${idq}`,
        method: 'get',
        reqAuthorize: true
      });
      setUsers(JSON.parse(JSON.stringify(data)));
    }
    fetchUsers()
  }, [id]);

  if (!users) {
    return (
      <LoadingComp type="icon" icontype="ring" />
    );
  }

  return (
    <>
    <Header locale={locale ?? getDefLocale()} />
    <div className='container' style={{paddingTop: '5rem', paddingBottom: '5rem'}}>
      {!users.userId && (
        <div className='row justify-content-center align-items-center p-3'>
          <div className='col-12 card p-3 text-center'>
            <div className='card-body'>
              <i className="bi-exclamation-triangle" style={{fontSize: "4rem"}}></i>
              <p>
                {t('usernotfound') ?? "User not found or you dont have permissions to view this page!"}
              </p>
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/pages/users`} locale={locale ?? getDefLocale()}>
                {t('btnback') ?? "Back"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className='row justify-content-center align-items-center p-3'>
        {!!users.userId && (
          <div className='col-12 p-3 text-center' key={users.userId}>
            <div className='card bcuserinfo'>
              <div className="cardwrapper">
                <Image src={'/images/'+(users.cover ?? 'default.jpg')} width={1200} height={300} alt={t('covertitle', {displayName: users.displayName}) ?? users.displayName + "'s Cover"} className={styles.userinfocover} priority />
                <Image src={'/images/'+(users.avatar ?? 'guest.png')} width={100} height={100} alt={t('avatartitle', {displayName: users.displayName}) ?? users.displayName + "'s Avatar"} className={styles.userinfoavatar + " bcavatar"} />
              </div>

              <div className='card-body p-3 mt-4'>
                <div className='card-text pt-3 pb-0 ps-0 pe-0'>
                  <h3 className='card-title'>{users.displayName}</h3>
                  <div className="textfrm">
                    <p>{t("display.lbluserid") ?? "User Id"} {users.userId}</p>
                    <p>{t("display.lblusername") ?? "Username"} {users.username}</p>
                    <p>{t("display.lblemail") ?? "Email"} {users.email}</p>
                    <p>{t("display.lbldisplayname") ?? "Display name"} {users.displayName}</p>
                    <p>{t("display.lblrole") ?? "Role"} {users.role}</p>
                    <p>{t("display.lblabout") ?? "About"} {users.about ?? 'N/A'}</p>
                    <p>{t("display.lblprivacy") ?? "Privacy"} {users.privacy ?? 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-12 mx-auto text-center">
          <Link className='btn btn-primary btn-rounded card-btn mt-3' href={'/pages/users'} locale={locale ?? getDefLocale()}>
            {t("btnback") ?? "Back"}
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}