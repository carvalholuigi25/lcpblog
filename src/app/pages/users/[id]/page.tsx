"use client";
import styles from "@/app/page.module.scss";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User } from '@/app/interfaces/user';
import Image from 'next/image';
import Link from 'next/link';
import FetchData from '@/app/utils/fetchdata';
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";

export default function UserPage() {
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
    <Header />
    <div className='container' style={{paddingTop: '5rem', paddingBottom: '5rem'}}>
      {!users.userId && (
        <div className='row justify-content-center align-items-center p-3'>
          <div className='col-12 card p-3 text-center'>
            <div className='card-body'>
              <i className="bi-exclamation-triangle" style={{fontSize: "4rem"}}></i>
              <p>User not found or you dont have permissions to view this page!</p>
              <Link className='btn btn-primary btn-rounded card-btn mt-3' href={`/pages/users`}>Back</Link>
            </div>
          </div>
        </div>
      )}

      <div className='row justify-content-center align-items-center p-3'>
        {!!users.userId && (
          <div className='col-12 p-3 text-center' key={users.userId}>
            <div className='card'>
              <div className="cardwrapper">
                <Image src={'/images/'+(users.cover ?? 'default.jpg')} width={1200} height={300} alt={users.displayName + "'s Cover"} className={styles.userinfocover} priority />
                <Image src={'/images/'+(users.avatar ?? 'guest.png')} width={100} height={100} alt={users.displayName + "'s Avatar"} className={styles.userinfoavatar} />
              </div>

              <div className='card-body p-3 mt-4'>
                <div className='card-text pt-3 pb-0 ps-0 pe-0'>
                  <h3 className='card-title'>{users.displayName}</h3>
                  <p>Id: {users.userId}</p>
                  <p>Username: {users.username}</p>
                  <p>Email: {users.email}</p>
                  <p>Display name: {users.displayName}</p>
                  <p>Role: {users.role}</p>
                  <p>About: {users.about ?? 'N/A'}</p>
                  <p>Privacy: {users.privacy ?? 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-12 mx-auto text-center">
          <Link className='btn btn-primary btn-rounded card-btn mt-3' href={'/pages/users'}>Back</Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}