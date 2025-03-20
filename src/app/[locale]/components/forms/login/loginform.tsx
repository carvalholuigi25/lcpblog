/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { getFromStorage, delFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { TFormLogData, floginSchema } from "@applocale/schemas/formSchemas";
import ShowAlert from "@applocale/components/alerts";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import {Link} from '@/app/i18n/navigation';
import axios from "axios";
import { getDefLocale } from "@/app/[locale]/helpers/defLocale";

const LoginForm = () => {
    const test = true;
    const [formData, setFormData] = useState({
        email: test ? 'luiscarvalho239@gmail.com' : '',
        password: test ? '1234' : ''
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [logInfo, setLogInfo] = useState(getFromStorage("logInfo"));
    const [avatarUser, setAvatarUser] = useState("avatars/guest.png");
    const { push } = useRouter();

    const {
        register,
        formState: { errors, isSubmitting },
    } = useForm<TFormLogData>({
        resolver: zodResolver(floginSchema),
    });

    useEffect(() => {
        if(!!isResetedForm) {
            setFormData({
                email: "",
                password: ""
            });
        }

        if(logInfo) {
            setIsLoggedIn(true);
        }
    }, [isResetedForm, logInfo]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = () => {
        setIsResetedForm(true);
    };

    const handleLogout = () => {
        if(logInfo) {
            delFromStorage("logInfo");
            setAvatarUser("avatars/guest.png");
            setLogInfo(null);
            setIsLoggedIn(false);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await axios({
                url: `${process.env.apiURL}/auth/authenticate`,
                method: 'post',
                data: formData
            }).then((r) => {
                const { id, displayName, username, email, jwtToken, avatar, role } = r.data;
                const datax: any = [{
                    id: id,
                    displayName: displayName,
                    username: username,
                    email: email,
                    avatar: avatar,
                    role: role,
                    jwtToken: jwtToken
                }];

                setAvatarUser(avatar);

                setTimeout(() => {
                    setIsLoggedIn(true);
                    setLogInfo(datax);
                    saveToStorage("logInfo", JSON.stringify(datax));
                    push("/");
                }, 200);
            }).catch((err) => {
                setIsLoggedIn(false);
                console.error(err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    const getDisplayName = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].displayName : null;
    };

    return (
        <>
            {!!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto">
                        <div className="card card-transparent">
                            <div className="card-body text-center">
                                <p>You already logged in as {getDisplayName()}!</p>
                                <button className="btn btn-primary btn-rounded mt-3" onClick={handleLogout}>Logout</button>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'} locale={getDefLocale()}>Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!isLoggedIn && (
                <>
                    <form className={styles.frmlog}>
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                        >
                            <Image src={"/images/" + avatarUser} width="100" height="100" alt="User's avatar" className={styles.logavatar} />
                        </motion.div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="email">Email</label>
                            <div className={styles.sformgroup}>
                                <i className={"bi bi-envelope " + styles.sformgroupico}></i>
                                <input {...register("email")} type="email" id="email" name="email" className={"form-control email mt-3 " + styles.sformgroupinp} placeholder="Write your email here..." value={formData.email} onChange={handleChange} required />
                            </div>

                            {errors.email && ShowAlert("danger", errors.email.message)}
                        </div>

                        <div className="form-group mt-3 text-center">
                            <label htmlFor="password">Password</label>
                            <div className={styles.sformgroup}>
                                <i className={"bi bi-pass " + styles.sformgroupico}></i>
                                <input {...register("password")} type="password" id="password" name="password" className={"form-control password mt-3 " + styles.sformgroupinp} placeholder="Write your password here..." value={formData.password} onChange={handleChange} required />
                            </div>

                            {errors.password && ShowAlert("danger", errors.password.message)}
                        </div>

                        <div className="d-inline-block mx-auto mt-3">
                            <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset}>Reset</button>
                            <button className="btn btn-primary btnlog btn-rounded ms-3" type="button" onClick={handleSubmit} disabled={isSubmitting}>Login</button>
                        </div>
                    </form>

                    <Link href="/auth/register" className="text-center mt-3" locale={getDefLocale()}>Dont have an account? Register here</Link>
                    <Link href="/" className="btn btn-primary btn-rounded text-center mt-3" locale={getDefLocale()}>Back to Home</Link>
                </>
            )}  
        </>
    );
}

export default LoginForm;