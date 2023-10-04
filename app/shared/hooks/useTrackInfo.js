import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSpotify from "app/shared/hooks/useSpotify";

export const useTrackInfo = () => {
    const trackId = useSelector(state => state.track.trackId);
    const [songInfo, setSongInfo] = useState();
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (trackId) {
                const trackInfo = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`,
                    },
                }).then(res => res.json());
                setSongInfo(trackInfo);
            }
        };
        fetchSongInfo();
    }, [trackId, session]);
    return songInfo;
};
