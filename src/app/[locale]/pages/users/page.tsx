/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/app/i18n/navigation';
import { User } from '@applocale/interfaces/user';
import { getDefLocale } from '@applocale/helpers/defLocale';
import Image from 'next/image';
import FetchData from '@applocale/utils/fetchdata';
import LoadingComp from '@applocale/components/ui/loadingcomp';
import Header from '@applocale/ui/header';
import Footer from '@applocale/ui/footer';

export default function AllUsersPage({ params }: { params: any }) {
  const {locale}: any = use(params);
  const t = useTranslations("pages.UsersPage");
  const [users, setUsers] = useState(new Array<User>());

  useEffect(() => {
    async function fetchUsers() {
      const data = await FetchData({
        url: 'api/users',
        method: 'get',
        reqAuthorize: true
      });

      if(data.data) {
        setUsers(JSON.parse(JSON.stringify(data.data)));
      }
    }
    fetchUsers()
  }, []);

  if (!users) {
    return ( 
      <LoadingComp type="icon" icontype="ring" />
    );
  }

  return (
    <>
    <Header locale={locale ?? getDefLocale()} />
    <div className='container' style={{paddingTop: '5rem', paddingBottom: '5rem'}}>
      {!users || users.length == 0 && ( 
        <div className='row justify-content-center align-items-center p-3'>
          <div className='col-12 card p-3 text-center'>
            <div className='card-body'>
              <i className="bi-exclamation-triangle" style={{fontSize: "4rem"}}></i>
              <p>{t('emptyusers') ?? "0 users or you dont have permissions to view this page!"}</p>
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>
                {t('btnback') ?? "Back"}
              </Link>
            </div>
          </div> 
        </div>
      )}
      
      <div className='row justify-content-center align-items-center p-3'>
        {!!users && users.map((user: User) => (
          <div className='col-12 col-md-6 col-lg-4 p-3 text-center' key={user.userId}>
            <div className='card allbcuserinfo'>
              <div className="cardwrapper">
                <Image src={'/images/'+(user.cover ?? 'default.jpg')} width={1200} height={300} alt={t('covertitle', {displayName: user.displayName}) ?? user.displayName + "'s Cover"} className={styles.alluserinfocover} priority />                
                <Image src={'/images/'+(user.avatar ?? 'guest.png')} width={100} height={100} alt={t('avatartitle', {displayName: user.displayName}) ?? user.displayName + "'s Avatar"} className={styles.alluserinfoavatar + " allbcavatar"} />
              </div>
              
              <div className='card-body p-3 mt-4'>
                <div className='card-text'>
                  <h3 className='card-title'>{user.displayName}</h3>
                  <Link className='btn btn-primary btn-rounded card-btn' href={`/pages/users/${user.userId}`} locale={locale ?? getDefLocale()}>
                    {t('btnviewprofile') ?? "View this profile"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className='col-12 mt-3 mx-auto text-center'>
          <p>
            {t('totalusers', {count: users.length}) ?? `Total users: ${users.length}`}
          </p>
          <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>
            {t('btnback') ?? "Back"}
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}