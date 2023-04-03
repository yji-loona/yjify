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
    const [showToast, setShowToast] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
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

    const test = () => {
        console.log("check");
        setShowToast(true);
    };

    return (
        <div className={style.yjify}>
            <Head>
                <title>yji.fy</title>
                <meta name="description" content='"spotify" like app' />
            </Head>
            <Toast message={"test"} showState={showToast} handleToast={() => setShowToast(false)} />
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className={style.yjify__wrapper}>
                        <div className={style.yjify__wrapper_sidebar} onClick={test}>
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
