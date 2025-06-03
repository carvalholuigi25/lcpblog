/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link } from '@/app/i18n/navigation';
import { useLocale, useTranslations } from "next-intl";
import { getFromStorage, delFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { useMySchemaLogin, type TFormLogData } from "@applocale/schemas/formSchemas";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import ShowAlert from "@applocale/components/ui/alerts";
import Toasts from "@applocale/components/ui/toasts/toasts";
import CountdownLogin from "@/app/[locale]/components/ui/countdowns/countdownlogin";

interface LoginStatus {
    attempts: number;
    status: string;
    dateLock?: Date | string;
    dateLockTimestamp?: number;
}

const LoginForm = () => {
    const test = true;
    const maxAttempts = 5;
    const disableLoginLockCheck = false;
    const { push } = useRouter();
    const t = useTranslations("ui.forms.auth.login");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginLocked, setIsLoginLocked] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [attempts, setAttempts] = useState<number>(1);
    const [dateCur, setDateCur] = useState(new Date().toISOString());
    const [logInfo, setLogInfo] = useState(getFromStorage("logInfo"));
    const [avatarUser, setAvatarUser] = useState("avatars/guest.png");
    const [dataToast, setDataToast] = useState({
        type: "",
        message: "",
        statusToast: false,
        displayName: ""
    } as DataToastsProps);
    const [formData, setFormData] = useState({
        email: test ? 'luiscarvalho239@gmail.com' : '',
        password: test ? '1234' : ''
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TFormLogData>({
        resolver: zodResolver(useMySchemaLogin()),
    });

    useEffect(() => {
        if (getFromStorage("loginStatus")) {
            setAttempts(parseInt("" + (JSON.parse(getFromStorage("loginStatus")!).attempts + 1)));
            setDateCur(JSON.parse(getFromStorage("loginStatus")!).dateLock);

            if (!disableLoginLockCheck) {
                setIsLoginLocked(JSON.parse(getFromStorage("loginStatus")!).status == "locked" ? true : false);
            }
        }

        if (!!isResetedForm) {
            setFormData({
                email: "",
                password: ""
            });
        }

        if (logInfo) {
            setIsLoggedIn(true);
        }
    }, [isResetedForm, logInfo, attempts, disableLoginLockCheck]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleReset = () => {
        setIsResetedForm(true);
    };

    const handleLogout = () => {
        if (logInfo) {
            delFromStorage("logInfo");
            setAvatarUser("avatars/guest.png");
            setLogInfo(null);
            setIsLoggedIn(false);
        }
    };

    const onFinish = () => {
        if(getFromStorage("loginStatus")) {
            const loginStatus = JSON.parse(getFromStorage("loginStatus")!);
            if(attempts >= maxAttempts && loginStatus.status == "locked" && new Date().getHours() >= new Date("" + loginStatus.dateLock).getHours()) {
                setAttempts(0);
                saveToStorage("loginStatus", JSON.stringify({
                    attempts: 0,
                    status: "unlocked"
                }));
                location.reload();
            }
        }
    }

    const onSubmit = async () => {
        if (!isLoginLocked) {
            const statusAttempt = attempts >= maxAttempts ? "locked" : "unlocked";

            if (attempts >= maxAttempts) {
                const today = new Date();
                today.setUTCHours(today.getHours() + 1);

                const loginStatus: LoginStatus = {
                    attempts: attempts,
                    status: statusAttempt,
                    dateLock: today,
                    dateLockTimestamp: today.getTime()
                };

                const dateFrm = new Date(loginStatus.dateLockTimestamp!).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: undefined, hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })

                setDataToast({
                    type: "error",
                    message: t('validation.errors.lblmaxattempts', { dateLock: "" + dateFrm }) ?? `Max attempts reached. Login will be unlocked in 1 hour. (Date: ${loginStatus.dateLock})`,
                    statusToast: true,
                    displayName: formData.email ?? ""
                });

                if (loginStatus.status == "locked" && new Date().getHours() <= new Date("" + loginStatus.dateLock).getHours()) {
                    setAttempts(0);
                }

                if (!disableLoginLockCheck) {
                    setIsLoginLocked(true);
                }

                saveToStorage("loginStatus", JSON.stringify(loginStatus));
                setIsResetedForm(true);

                setTimeout(() => {
                    location.reload();
                }, 500);

                return false;
            }

            try {
                if (formData.email.length == 0) {
                    setDataToast({
                        type: "error",
                        message: t('errors.lblreqemail') ?? "Please provide your email",
                        statusToast: true,
                        displayName: formData.email ?? ""
                    });
                    return false;
                }

                if (formData.password.length == 0) {
                    setDataToast({
                        type: "error",
                        message: t('errors.lblreqpassword') ?? "Please provide your password",
                        statusToast: true,
                        displayName: formData.email
                    });
                    return false;
                }

                await axios({
                    url: `${process.env.apiURL}/auth/authenticate`,
                    method: 'post',
                    data: formData
                }).then((r) => {
                    setAttempts(0);
                    const { id, displayName, username, email, jwtToken, avatar, role } = r.data;
                    const loginStatus: LoginStatus = {
                        attempts: attempts > 0 ? (attempts - attempts) : 0,
                        status: "unlocked"
                    };

                    const datax: any = [{
                        id: id,
                        displayName: displayName,
                        username: username,
                        email: email,
                        avatar: avatar,
                        role: role,
                        jwtToken: jwtToken
                    }];

                    saveToStorage("loginStatus", JSON.stringify(loginStatus));

                    if (!disableLoginLockCheck) {
                        setIsLoginLocked(false);
                    }

                    setAvatarUser(avatar);

                    setDataToast({
                        type: "success",
                        message: t("apimessages.success", { username: username }) ?? `Logged in as ${username}!`,
                        statusToast: true,
                        displayName: displayName
                    });

                    setTimeout(() => {
                        setIsLoggedIn(true);
                        setLogInfo(datax);
                        saveToStorage("logInfo", JSON.stringify(datax));
                        push("/" + locale);
                    }, 200);
                }).catch((err) => {
                    console.error(err);
                    setIsLoggedIn(false);

                    if (attempts < maxAttempts) {
                        setAttempts(attempts + 1);

                        const loginStatus: LoginStatus = {
                            attempts: attempts,
                            status: attempts >= maxAttempts ? "locked" : "unlocked"
                        };

                        saveToStorage("loginStatus", JSON.stringify(loginStatus));

                        setDataToast({
                            type: "error",
                            message: t("apimessages.error", { attempts: attempts, maxAttempts: maxAttempts, message: "" + err.message }) ?? `Failed to login (${attempts}/${maxAttempts})! Message: ${err.message}`,
                            statusToast: true,
                            displayName: formData.email
                        });
                    }

                    setTimeout(() => {
                        location.reload();
                    }, 1000 * 1);
                });
            } catch (error) {
                console.error(error);

                if (attempts < maxAttempts) {
                    setAttempts(attempts + 1);

                    const loginStatus: LoginStatus = {
                        attempts: attempts,
                        status: attempts >= maxAttempts ? "locked" : "unlocked"
                    };

                    saveToStorage("loginStatus", JSON.stringify(loginStatus));

                    setDataToast({
                        type: "error",
                        message: t("apimessages.errorapi", { attempts: attempts, maxAttempts: maxAttempts, message: "" + error }) ?? `Error when trying to login (${attempts}/${maxAttempts})! Message: ${error}`,
                        statusToast: true,
                        displayName: formData.email
                    });
                }

                setTimeout(() => {
                    location.reload();
                }, 1000 * 1);
            }
        }
    };

    const getDisplayName = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].displayName : null;
    };

    return (
        <>
            {dataToast.statusToast && <Toasts id={"toastLoginFrm"} data={dataToast} />}

            {!!isLoggedIn && (
                <>
                    <div className="col-12 mx-auto">
                        <div className="card card-transparent">
                            <div className="card-body text-center">
                                <p>{t('lblloggedin', { displayName: getDisplayName() }) ?? `You already logged in as ${getDisplayName()}!`}</p>
                                <button className="btn btn-primary btn-rounded mt-3" onClick={handleLogout}>
                                    {tbtn('btnlogout') ?? "Logout"}
                                </button>
                                <Link className="btn btn-primary btn-rounded ms-3 mt-3" href={'/'} locale={locale}>
                                    {tbtn('btnback') ?? "Back"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!isLoggedIn && (
                <>
                    <form className={"frmlog" + (isLoginLocked ? " frmdisabled" : "")} onSubmit={handleSubmit(onSubmit)}>
                        <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            className={isLoginLocked ? "hidden" : ""}
                        >
                            <Image src={"/images/" + avatarUser} width="100" height="100" alt="User's avatar" className={styles.logavatar} />
                        </motion.div>

                        <div className={"form-group mt-3 text-center" + (isLoginLocked ? " hidden" : "")}>
                            <label htmlFor="email">{t('lblemail') ?? "Email"}</label>
                            <div className={styles.sformgroup}>
                                <i className={"bi bi-envelope " + styles.sformgroupico}></i>
                                <input {...register("email")} type="email" id="email" name="email" className={"form-control email mt-3 " + styles.sformgroupinp} placeholder={t('inpemail') ?? "Write your email here..."} value={formData.email} onChange={handleChange} disabled={isLoginLocked} required />
                            </div>

                            {errors.email && ShowAlert("danger", errors.email.message)}
                        </div>

                        <div className={"form-group mt-3 text-center" + (isLoginLocked ? " hidden" : "")}>
                            <label htmlFor="password">{t('lblpassword') ?? "Password"}</label>
                            <div className={styles.sformgroup}>
                                <i className={"bi bi-pass " + styles.sformgroupico}></i>
                                <input {...register("password")} type="password" id="password" name="password" className={"form-control password mt-3 " + styles.sformgroupinp} placeholder={t('inppassword') ?? "Write your password here..."} value={formData.password} onChange={handleChange} disabled={isLoginLocked} required />
                            </div>

                            {errors.password && ShowAlert("danger", errors.password.message)}
                        </div>

                        <div className={"d-inline-block mx-auto mt-3" + (isLoginLocked ? " hidden" : "")}>
                            <button className="btn btn-secondary btnreset btn-rounded" type="reset" onClick={handleReset} disabled={isLoginLocked}>
                                {t('btnreset') ?? "Reset"}
                            </button>
                            <button className="btn btn-primary btnlog btn-rounded ms-3" type="submit" disabled={isSubmitting || isLoginLocked}>
                                {t('btnlogin') ?? "Login"}
                            </button>
                        </div>
                    </form>

                    {isLoginLocked && getFromStorage("loginStatus")! && (
                        <>
                            <p className="text-center">{t('validation.errors.lblmaxattempts', { dateLock: JSON.parse(getFromStorage("loginStatus")!).dateLock }) ?? `Max attempts reached. Login will be unlocked in 1 hour. (Date: ${JSON.parse(getFromStorage("loginStatus")!).dateLock})`}</p>

                            <CountdownLogin datecur={dateCur} onFinish={onFinish} />
                        </>
                    )}

                    <Link href="/auth/register" className="text-center mt-3" locale={locale}>
                        {t('lblrecoveraccount') ?? "Dont have an account? Register here"}
                    </Link>
                    <Link href="/" className="btn btn-primary btn-rounded text-center mt-3" locale={locale}>
                        {t('btnback') ?? "Back to Home"}
                    </Link>
                </>
            )}
        </>
    );
}

export default LoginForm;