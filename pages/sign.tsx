import { NextPage } from "next";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import style from "./sign.module.scss";

const Sign: NextPage = ({ providers }: any) => {
    const { data: session, status } = useSession();
    console.log(session, providers);
    if (session) {
        return (
            <div className={style.sign}>
                <i id="spotify" className={`fa-brands fa-spotify ${style.sign__logo}`}></i>
                {session.user && (
                    <p className={style.sign__welcome}>Welcome back, {session.user.name}</p>
                )}
                <button className={style.sign__button} onClick={() => signOut()}>
                    Log out
                </button>
            </div>
        );
    }
    return (
        <div className={style.sign}>
            <i id="spotify" className={`fa-brands fa-spotify ${style.sign__logo}`}></i>
            {Object.values(providers).map((provider: any) => (
                <button
                    key={provider.name}
                    className={style.sign__button}
                    onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
                    Login with {provider.name}
                </button>
            ))}
        </div>
    );
};

export default Sign;

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: {
            providers,
        },
    };
}
