import MainObserver from "app/widgets/MainObserver";
import Sidebar from "app/widgets/Sidebar";
import { NextPage } from "next";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "app/shared/store/store";
import Head from "next/head";
import style from "./style.module.scss";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { userInit } from "app/shared/slices/userSlice";
import { useRouter } from "next/router";
import Player from "app/widgets/Player/Player";
import Toast from "app/shared/ui/Toast/Toast";

const YjiFy: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const showToast = useSelector((state: RootState) => state.toast.isActive);
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign");
        }
        if (status === "authenticated" && session.user) {
            dispatch(userInit({ data: session }));
            setIsLoading(false);
        }
    }, [dispatch, status]);

    return (
        <div className={style.yjify}>
            <Head>
                <title>yji.fy</title>
                <meta name="description" content='"spotify" like app' />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
            </Head>
            <Toast showState={showToast} />
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className={style.yjify__wrapper}>
                        <div className={style.yjify__wrapper_sidebar}>
                            <Sidebar defWidth={240} />
                        </div>
                        <div className={style.yjify__wrapper_center}>
                            <MainObserver />
                        </div>
                    </div>
                    <div className={style.yjify__player}>
                        <Player />
                    </div>
                </>
            )}
        </div>
    );
};

export default YjiFy;
