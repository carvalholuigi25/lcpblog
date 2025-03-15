/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { TFormUsers, fusersSchema } from "@applocale/schemas/formSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getImagePath } from "@applocale/functions/functions";
import { Link } from '@/app/i18n/navigation';
import { User } from "@applocale/interfaces/user";
import ShowAlert from "@applocale/components/alerts";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";

const EditUsersForm = ({id, data}: {id: number, data: User}) => {
    const [formData, setFormData] = useState({
        userId: data.userId ?? 1,
        username: data.username ?? "",
        password: data.password ?? "",
        email: data.email ?? "",
        displayName: data.displayName ?? "",
        avatar: data.avatar ?? "avatars/guest.png",
        cover: data.cover ?? "covers/default.jpg",
        about: data.about ?? "",
        role: data.role ?? "user",
        privacy: data.privacy ?? "locked",
        userInfoId: data.usersInfoId ?? 1
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [logInfo] = useState(getFromStorage("logInfo"));
    const [loading, setLoading] = useState(true);
    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
    } = useForm<TFormUsers>({
        resolver: zodResolver(fusersSchema),
    });

    useEffect(() => {
        if(!!isResetedForm) {
            setFormData({
                userId: data.userId ?? 1,
                username: data.username ?? "",
                password: data.password ?? "",
                email: data.email ?? "",
                displayName: data.displayName ?? "",
                avatar: data.avatar ?? "avatars/guest.png",
                cover: data.cover ?? "covers/default.jpg",
                about: data.about ?? "",
                role: data.role ?? "user",
                privacy: data.privacy ?? "locked",
                userInfoId: data.usersInfoId ?? 1
            });
        }

        if(logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }
    }, [isResetedForm, logInfo, data, loading]);

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

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = () => {
        setIsResetedForm(true);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await FetchDataAxios({
                url: `api/users/`+id,
                method: 'put',
                data: formData,
                reqAuthorize: true,
            }).then(async (r) => {
                console.log(r);

                setTimeout(async () => {
                    alert("The user (id: "+id+") has been updated sucessfully!");
                    push("/");
                }, 1000 / 2);
            }).catch((err) => {
                console.error(err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            {!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto p-3" style={{marginTop: '3rem'}}>
                        <div className="card">
                            <div className="card-body text-center">
                                <i className="bi bi-exclamation-triangle mx-auto" style={{fontSize: '4rem'}} />
                                <p className="mt-3">You are not authorized to see this page!</p>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'}>Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">Edit users</h3>
                    <form className={styles.frmeditusers}>
                        <div className="form-group mt-3 text-center hidden">
                            <label htmlFor="userId">User Id</label>
                            <div className={styles.sformgroup}>
                                <input {...register("userId")} type="hidden" id="userId" name="userId" className={"form-control userId mt-3 " + styles.sformgroupinp} placeholder="Write your User Id here..." value={formData.userId} onChange={handleChange} disabled />
                            </div>

                            {errors.userId && ShowAlert("danger", errors.userId.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="username">Username</label>
                            <div className={styles.sformgroup}>
                                <input {...register("username")} type="text" id="username" name="username" className={"form-control username mt-3 " + styles.sformgroupinp} placeholder="Write your username here..." value={formData.username} onChange={handleChange} required />
                            </div>

                            {errors.username && ShowAlert("danger", errors.username.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="password">Password</label>
                            <div className={styles.sformgroup}>
                                <input {...register("password")} type="password" id="password" name="password" className={"form-control password mt-3 " + styles.sformgroupinp} placeholder="Write your password here..." value={formData.password} onChange={handleChange} required />
                            </div>

                            {errors.password && ShowAlert("danger", errors.password.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="email">Email</label>
                            <div className={styles.sformgroup}>
                                <input {...register("email")} type="email" id="email" name="email" className={"form-control email mt-3 " + styles.sformgroupinp} placeholder="Write your email here..." value={formData.email} onChange={handleChange} required />
                            </div>

                            {errors.email && ShowAlert("danger", errors.email.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="displayName">Display Name</label>
                            <div className={styles.sformgroup}>
                                <input {...register("displayName")} type="text" id="displayName" name="displayName" className={"form-control displayName mt-3 " + styles.sformgroupinp} placeholder="Write your display name here..." value={formData.displayName} onChange={handleChange} required />
                            </div>

                            {errors.displayName && ShowAlert("danger", errors.displayName.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="avatar">Image Url:</label>
                            <div className={styles.sformgroup}>
                                <input {...register("avatar")} type="text" id="avatar" name="avatar" className={"form-control avatar mt-3 " + styles.sformgroupinp} placeholder="Write your avatar url here..." value={formData.avatar} onChange={handleChange} />
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    className="d-inline-block mt-3"
                                >
                                    <Image 
                                        src={getImagePath(formData.avatar)} 
                                        width="150" 
                                        height="150" 
                                        alt={formData.username + "'s avatar"}
                                        className={styles.inpimgprev + " " + styles.inpimgprevavatar} 
                                        onError={(event: any) => {
                                            event.target.id = "/images/avatars/guest.png";
                                            event.target.srcset = "/images/avatars/guest.png";
                                        }}
                                        priority
                                    />
                                </motion.div>
                            </div>

                            {errors.avatar && ShowAlert("danger", errors.avatar.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="cover">Cover Url:</label>
                            <div className={styles.sformgroup}>
                                <input {...register("cover")} type="text" id="cover" name="cover" className={"form-control cover mt-3 " + styles.sformgroupinp} placeholder="Write your cover url here..." value={formData.cover} onChange={handleChange} />
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    className="d-inline-block mt-3"
                                >
                                    <Image 
                                        src={getImagePath(formData.cover)} 
                                        width="150" 
                                        height="150" 
                                        alt={formData.username + "'s cover"}
                                        className={styles.inpimgprev + " " + styles.inpimgprevcover} 
                                        onError={(event: any) => {
                                            event.target.id = "/images/covers/default.jpg";
                                            event.target.srcset = "/images/covers/default.jpg";
                                        }}
                                        priority
                                    />
                                </motion.div>
                            </div>

                            {errors.cover && ShowAlert("danger", errors.cover.message)}
                        </div>

                        <div className="form-group mt-3 text-center hidden">
                            <label htmlFor="role">Role</label>
                            <div className={styles.sformgroup}>
                                <input {...register("role")} type="hidden" id="role" name="role" className={"form-control role mt-3 " + styles.sformgroupinp} placeholder="Write your role here..." value={formData.role} onChange={handleChange} disabled />
                            </div>

                            {errors.role && ShowAlert("danger", errors.role.message)}
                        </div>

                        <div className="form-group mt-3 text-center hidden">
                            <label htmlFor="privacy">Privacy</label>
                            <div className={styles.sformgroup}>
                                <input {...register("privacy")} type="hidden" id="privacy" name="privacy" className={"form-control privacy mt-3 " + styles.sformgroupinp} placeholder="Write your privacy here..." value={formData.privacy} onChange={handleChange} disabled />
                            </div>

                            {errors.privacy && ShowAlert("danger", errors.privacy.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="about">About</label>
                            <div className={styles.sformgroup}>
                                <textarea {...register("about")} id="about" name="about" className={"form-control about mt-3 " + styles.sformgroupinp} placeholder="Write your about here..." value={formData.about} onChange={handleChange} />
                            </div>

                            {errors.about && ShowAlert("danger", errors.about.message)}
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>Reset</button>
                            <button className="btn btn-primary btnedit btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>Edit</button>
                        </div>
                    </form>
                    
                    <div className="col-12">
                        <div className="mt-3 mx-auto text-center">
                            <Link href={'/'} className="btn btn-primary btn-rounded">Back</Link>
                        </div>
                    </div>
                </>
            )}  
        </div>
    );
}

export default EditUsersForm;