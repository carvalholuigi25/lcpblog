/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "@applocale/page.module.scss";
import Image from "next/image";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from '@/app/i18n/navigation';
import { useLocale, useTranslations } from "next-intl";
import { getFromStorage, delFromStorage, saveToStorage } from "@applocale/hooks/localstorage";
import { useMySchemaLogin, type TFormLogData } from "@applocale/schemas/formSchemas";
import { getDefLocale } from "@applocale/helpers/defLocale";
import { DataToastsProps } from "@applocale/interfaces/toasts";
import { LoginStatus, UserSessionsTypes, UserSessionsTypesTimes } from "@applocale/interfaces/user";
import ShowAlert from "@applocale/components/ui/alerts";
import Toasts from "@applocale/components/ui/toasts/toasts";
import CountdownLogin from "@applocale/components/ui/countdowns/countdownlogin";

const LoginForm = () => {
    const test = true;
    const maxAttempts = 5;
    const disableLoginLockCheck = false;

    const t = useTranslations("ui.forms.auth.login");
    const tbtn = useTranslations("ui.buttons");
    const locale = useLocale() ?? getDefLocale();
    const { push } = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoginLocked, setIsLoginLocked] = useState(false);
    const [isResetedForm, setIsResetedForm] = useState(false);
    const [attempts, setAttempts] = useState<number>(1);
    const [isAttemptsUpdated, setIsAttemptsUpdated] = useState(false);
    const [dateCur, setDateCur] = useState(new Date().toISOString());
    const [logInfo, setLogInfo] = useState(getFromStorage("logInfo"));
    const [avatarUser, setAvatarUser] = useState("avatars/guest.png");
    const isEnabledSessionType = false;
    
    const [dataToast, setDataToast] = useState({
        type: "",
        message: "",
        statusToast: false,
        displayName: ""
    } as DataToastsProps);

    const [formData, setFormData] = useState({
        email: test ? 'luiscarvalho239@gmail.com' : '',
        password: test ? '1234' : '',
        type: UserSessionsTypes.Permanent,
        modeTimer: UserSessionsTypesTimes.None,
        valueTimer: new Date()
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TFormLogData>({
        resolver: zodResolver(useMySchemaLogin()),
    });

    const loadAttemptsIfLoginStatusIsDeleted = useCallback(async () => {
        if(!getFromStorage("loginStatus")) {
            await axios({
                url: `${process.env.apiURL}/api/loginstatus`,
                method: 'get'
            }).then((r) => {
                console.log(r);
                const data = r.data;
                
                if(data && data.length > 0) {
                    const nlogattempts: LoginStatus = {
                        loginStatId: data.loginStatId,
                        attempts: data.attempts,
                        status: data.status,
                        dateLock: data.dateLock,
                        dateLockTimestamp: data.dateLockTimestamp,
                        type: data.type,
                        modeTimer: data.modeTimer,
                        valueTimer: data.valueTimer,
                        userId: data.userId
                    };

                    saveToStorage("loginStatus", JSON.stringify(nlogattempts));
                }
            }).catch((e) => {
                console.log(e);
            });
        }
    }, []);

    const doLoginStatusIntoDB = useCallback(async (loginStatus: LoginStatus) => {
        if(isAttemptsUpdated) {
            const typem = getFromStorage("loginStatus") ? "update" : "create";
            const method = typem == "create" ? "post" : getFromStorage("loginStatus") ? "put" : "post";
            const uid = typem == "create" ? "" : method == "put" ? "/"+getUserId() : "";
            const today = DateTime.now().setLocale(getDefLocale()).set({hour: new Date().getHours()+1});

            await axios({
                url: `${process.env.apiURL}/api/loginstatus${uid}`,
                method: method,
                data: {
                    loginStatId: loginStatus.loginStatId ?? 1,
                    attempts: loginStatus.attempts ?? attempts,
                    status: loginStatus.attempts >= maxAttempts ? "locked" : "unlocked",
                    dateLock: loginStatus.dateLock ?? today.toISO()!,
                    dateLockTimestamp: loginStatus.dateLockTimestamp ?? today.toMillis(),
                    type: loginStatus.type ?? UserSessionsTypes.Permanent,
                    modeTimer: loginStatus.modeTimer ?? UserSessionsTypesTimes.None,
                    valueTimer: loginStatus.valueTimer ?? new Date(),
                    userId: getUserId()
                }
            }).then((r) => {
                console.log(r);
            }).catch((e) => {
                console.log(e);
            });
        }
    }, [attempts, isAttemptsUpdated]);

    useEffect(() => {
        loadAttemptsIfLoginStatusIsDeleted();
        
        if (getFromStorage("loginStatus")) {
            const loginStatus = JSON.parse(getFromStorage("loginStatus")!);

            if (!disableLoginLockCheck) {
                setIsLoginLocked(loginStatus.status == "locked" ? true : false);
            }

            setAttempts(parseInt("" + (loginStatus.attempts + 1)));
            setDateCur(loginStatus.dateLock);
            doLoginStatusIntoDB(loginStatus);
        }

        if (!!isResetedForm) {
            setFormData({
                email: "",
                password: "",
                type: UserSessionsTypes.Permanent,
                modeTimer: UserSessionsTypesTimes.None,
                valueTimer: new Date()
            });
        }

        if (logInfo) {
            setIsLoggedIn(true);
        }
    }, [isResetedForm, logInfo, attempts, disableLoginLockCheck, loadAttemptsIfLoginStatusIsDeleted, doLoginStatusIntoDB]);

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

    const onFinish = async () => {
        if(getFromStorage("loginStatus")) {
            const loginStatus = JSON.parse(getFromStorage("loginStatus")!);
            if(attempts >= maxAttempts && loginStatus.status == "locked" && new Date().getHours() <= new Date("" + loginStatus.dateLock).getHours()) {
                if (!disableLoginLockCheck) {
                    setIsLoginLocked(false);
                }

                const nloginStatus: LoginStatus = {
                    attempts: 0,
                    status: "unlocked",
                    dateLock: "",
                    dateLockTimestamp: 0,
                    type: loginStatus.type ?? UserSessionsTypes.Permanent,
                    modeTimer: loginStatus.modeTimer ?? UserSessionsTypesTimes.None,
                    valueTimer: loginStatus.valueTimer ?? new Date(),
                    userId: getUserId()
                };

                setAttempts(0);
                saveToStorage("loginStatus", JSON.stringify(nloginStatus));
                setIsAttemptsUpdated(true);
            }
        }
    }

    const onSubmit = async () => {
        if (!isLoginLocked) {
            const statusAttempt = attempts >= maxAttempts ? "locked" : "unlocked";
            const today = DateTime.now().setLocale(getDefLocale()).set({hour: new Date().getHours()+1});
            const loginStatus: LoginStatus = {
                attempts: attempts,
                status: statusAttempt,
                dateLock: today.toISO()!,
                dateLockTimestamp: today.toMillis(),
                type: formData.type,
                modeTimer: formData.modeTimer,
                valueTimer: formData.valueTimer,
                userId: getUserId()
            };

            if (attempts >= maxAttempts) {
                const dateFrm = today.toLocaleString(DateTime.DATETIME_FULL);

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
                        status: "unlocked",
                        dateLock: today.toISO()!,
                        dateLockTimestamp: today.toMillis(),
                        type: formData.type,
                        modeTimer: formData.modeTimer,
                        valueTimer: formData.valueTimer,
                        userId: getUserId()
                    };

                    const datax: any = [{
                        id: id,
                        displayName: displayName,
                        username: username,
                        email: email,
                        avatar: avatar,
                        role: role,
                        jwtToken: jwtToken,
                        sessionsTypes: formData.type,
                        sessionsModeTimer: formData.modeTimer,
                        sessionsValueTimer: formData.valueTimer
                    }];

                    if (!disableLoginLockCheck) {
                        setIsLoginLocked(false);
                    }

                    saveToStorage("loginStatus", JSON.stringify(loginStatus));
                    setAvatarUser(avatar);

                    setDataToast({
                        type: "success",
                        message: t("apimessages.success", { username: username }) ?? `Logged in as ${username}!`,
                        statusToast: true,
                        displayName: displayName
                    });

                    setTimeout(() => {
                        setIsAttemptsUpdated(true);
                        setIsLoggedIn(true);
                        setLogInfo(datax);
                        saveToStorage("logInfo", JSON.stringify(datax));
                        push("/" + locale);
                    }, 1000);
                }).catch((err) => {
                    console.error(err);
                    setIsLoggedIn(false);

                    if (attempts < maxAttempts) {
                        setAttempts(attempts + 1);

                        const loginStatus: LoginStatus = {
                            attempts: attempts,
                            status: attempts >= maxAttempts ? "locked" : "unlocked",
                            dateLock: today.toISO()!,
                            dateLockTimestamp: today.toMillis(),
                            type: formData.type,
                            modeTimer: formData.modeTimer,
                            valueTimer: formData.valueTimer,
                            userId: getUserId()
                        };

                        saveToStorage("loginStatus", JSON.stringify(loginStatus));
                        setIsAttemptsUpdated(true);

                        setDataToast({
                            type: "error",
                            message: t("apimessages.error", { attempts: attempts, maxAttempts: maxAttempts, message: "" + err.message }) ?? `Failed to login (${attempts}/${maxAttempts})! Message: ${err.message}`,
                            statusToast: true,
                            displayName: formData.email
                        });
                    }

                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                });
            } catch (error) {
                console.error(error);

                if (attempts < maxAttempts) {
                    setAttempts(attempts + 1);

                    const loginStatus: LoginStatus = {
                        attempts: attempts,
                        status: attempts >= maxAttempts ? "locked" : "unlocked",
                        dateLock: today.toISO()!,
                        dateLockTimestamp: today.toMillis(),
                        type: formData.type,
                        modeTimer: formData.modeTimer,
                        valueTimer: formData.valueTimer,
                        userId: getUserId()
                    };

                    saveToStorage("loginStatus", JSON.stringify(loginStatus));
                    setIsAttemptsUpdated(true);

                    setDataToast({
                        type: "error",
                        message: t("apimessages.errorapi", { attempts: attempts, maxAttempts: maxAttempts, message: "" + error }) ?? `Error when trying to login (${attempts}/${maxAttempts})! Message: ${error}`,
                        statusToast: true,
                        displayName: formData.email
                    });
                }

                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        }
    };

    const getDisplayName = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].displayName : null;
    };

    const getUserId = () => {
        return getFromStorage("logInfo") ? JSON.parse(getFromStorage("logInfo")!)[0].userId : 1;
    };

    return (
        <>
            {dataToast.statusToast && <Toasts id={"toastLoginFrm"} data={dataToast} modeType={0} />}

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
                        
                        {isEnabledSessionType && (
                            <>
                                <div className={"form-group mt-3 text-center" + (isLoginLocked ? " hidden" : "")}>
                                    <label htmlFor="type">{t("lblsessionstype") ?? "Session type"}</label>
                                    <select {...register("type")} id="type" name="type" className={"form-control type mt-3 " + styles.sformgroupinp} value={formData.type} onChange={handleChange} disabled={isLoginLocked}>
                                        <option disabled>{t('inpsessionstype.options.sel') ?? "Select the option of session type"}</option>
                                        <option value={"permanent"}>{t('inpsessionstype.options.permanent') ?? "Permanent"}</option>
                                        <option value={"temporary"}>{t('inpsessionstype.options.temporary') ?? "Temporary"}</option>
                                    </select>
                                </div>

                                {formData.type == "temporary" && (
                                    <>
                                        <div className={"form-group mt-3 text-center" + (isLoginLocked ? " hidden" : "")}>
                                            <label htmlFor="modeTimer">{t('lblsessionsmodetimer') ?? "Session mode timer"}</label>
                                            <select {...register("modeTimer")} id="modeTimer" name="modeTimer" className={"form-control modeTimer mt-3 " + styles.sformgroupinp} value={formData.modeTimer} onChange={handleChange} disabled={isLoginLocked}>
                                                <option disabled>{t('inpsessionsmodetimer.options.sel') ?? "Select the option of session mode timer"}</option>
                                                <option value={"week"}>{t('inpsessionsmodetimer.options.week') ?? "1 week"}</option>
                                                <option value={"month"}>{t('inpsessionsmodetimer.options.month') ?? "1 month"}</option>
                                                <option value={"custom"}>{t('inpsessionsmodetimer.options.custom') ?? "Custom"}</option>
                                            </select>
                                        </div>

                                        {formData.modeTimer == "custom" && (
                                            <div className={"form-group mt-3 text-center" + (isLoginLocked ? " hidden" : "")}>
                                                <label htmlFor="valueTimer">{t('lblsessionsvaltimer') ?? 'Session value timer (date)'}</label>
                                                <input {...register("valueTimer")} type="datetime-local" step={1} name="valueTimer" id="valueTimer" className={"form-control valueTimer mt-3 " + styles.sformgroupinp} value={formData.valueTimer.toString()} onChange={handleChange} disabled={isLoginLocked} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
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