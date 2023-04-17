import "@/styles/globals.css";
import "@/styles/global.scss";
import "@/styles/slick-slider.css";
import { Provider } from "react-redux";
import store, { persistor } from "app/shared/store/store";
import { PersistGate } from "redux-persist/integration/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import Theme from "app/shared/ui/ThemeProvider";

export default function App({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
    return (
        <SessionProvider session={session}>
            <Script
                src="https://kit.fontawesome.com/ca3f6e4cb0.js"
                strategy="beforeInteractive"
                crossOrigin="anonymous"
            />
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Theme />
                    <main>
                        <Component {...pageProps} />
                    </main>
                </PersistGate>
            </Provider>
        </SessionProvider>
    );
}
