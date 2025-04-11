/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import styles from "@applocale/page.module.scss";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMySchemaUsers, type TFormUsers } from "@applocale/schemas/formSchemas";
import { getFromStorage } from "@applocale/hooks/localstorage";
import { getImagePath } from "@applocale/functions/functions";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { Link } from '@/app/i18n/navigation';
import ShowAlert from "@applocale/components/alerts";
import FetchDataAxios from "@applocale/utils/fetchdataaxios";
import LoadingComp from "@applocale/components/loadingcomp";

const AddUsersForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        displayName: "",
        avatar: "avatars/guest.png",
        cover: "covers/default.jpg",
        about: ""
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
        resolver: zodResolver(useMySchemaUsers()),
    });

    useEffect(() => {
        if(!!isResetedForm) {
            setFormData({
                username: "",
                password: "",
                email: "",
                displayName: "",
                avatar: "avatars/guest.png",
                cover: "covers/default.jpg",
                about: ""
            });
        }

        if(logInfo) {
            setIsLoggedIn(true);
            setLoading(false);
        }
    }, [isResetedForm, logInfo, loading]);

    if (loading) {
        return (
            <LoadingComp type="icon" icontype="ring" />
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
                url: `api/users`,
                method: 'post',
                data: formData,
                reqAuthorize: false
            }).then(async (r) => {
                console.log(r);

                setTimeout(async () => {
                    alert("The user has been added sucessfully!");
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
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'} locale={getDefLocale()}>Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!!isLoggedIn && (
                <>
                    <h3 className="title mx-auto text-center">Add users</h3>

                    <form className={styles.frmaddusers}>
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
                                        alt={formData.username + "'s avatar"}
                                        width="150" 
                                        height="150"
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
                                        alt={formData.username + "'s cover"}
                                        width="600" 
                                        height="300" 
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

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="about">About</label>
                            <div className={styles.sformgroup}>
                                <textarea {...register("about")} id="about" name="about" className={"form-control about mt-3 " + styles.sformgroupinp} placeholder="Write your about here..." value={formData.about} onChange={handleChange} />
                            </div>

                            {errors.about && ShowAlert("danger", errors.about.message)}
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>Reset</button>
                            <button className="btn btn-primary btnadd btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>Add</button>
                        </div>
                    </form>
                    
                    <div className="col-12">
                        <div className="mt-3 mx-auto text-center">
                            <Link href={'/'} className="btn btn-primary btn-rounded" locale={getDefLocale()}>Back</Link>
                        </div>
                    </div>
                </>
            )}  
        </div>
    );
}

export default AddUsersForm;