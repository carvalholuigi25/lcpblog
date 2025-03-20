"use client";
import { useEffect, useState } from 'react';
import { User } from '@applocale/interfaces/user';
import {Link} from '@/app/i18n/navigation';
import Image from 'next/image';
import styles from "@applocale/page.module.scss";
import FetchData from '@applocale/utils/fetchdata';
import Header from '@applocale/ui/header';
import Footer from '@applocale/ui/footer';
import { getDefLocale } from '../../helpers/defLocale';

export default function AllUsersPage({locale}: {locale: string}) {
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
      <div className='container'>
        <div className='row justify-content-center align-items-center p-3'>
          <div className='col-12 card p-3 text-center'>
            <div className='card-body'>
              <i className="bi-clock" style={{fontSize: "4rem"}}></i>
              <p>Loading...</p> 
            </div>
          </div>
        </div>
      </div>
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
              <p>0 users or you dont have permissions to view this page!</p>
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>Back</Link>
            </div>
          </div> 
        </div>
      )}
      
      <div className='row justify-content-center align-items-center p-3'>
        {!!users && users.map((user: User) => (
          <div className='col-12 col-md-6 col-lg-4 p-3 text-center' key={user.userId}>
            <div className='card'>
              <div className="cardwrapper">
                <Image src={'/images/'+(user.cover ?? 'default.jpg')} width={1200} height={300} alt={user.displayName + "'s Cover"} className={styles.alluserinfocover} priority />                
                <Image src={'/images/'+(user.avatar ?? 'guest.png')} width={100} height={100} alt={user.displayName + "'s Avatar"} className={styles.alluserinfoavatar} />
              </div>
              
              <div className='card-body'>
                <div className='card-text mt-4'>
                  <h3 className='card-title'>{user.displayName}</h3>
                  <Link className='btn btn-primary btn-rounded card-btn' href={`/pages/users/${user.userId}`} locale={locale ?? getDefLocale()}>View Profile</Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className='col-12 mt-3 mx-auto text-center'>
          <p>Total users: {users.length}</p>
          <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/`} locale={locale ?? getDefLocale()}>Back</Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}