import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import spotifyApi from "app/shared/lib/spotify";

function useSpotify() {
    const { data: session, status } = useSession();
    useEffect(() => {
        if (session) {
            if (session.error === "refresh token error") {
                signIn();
            }
            spotifyApi.setAccessToken(session.user.accessToken);
        }
    }, [session]);
    return spotifyApi;
}

export default useSpotify;
