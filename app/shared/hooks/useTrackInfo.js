// useTrackInfo.js
import useSpotify from "app/shared/hooks/useSpotify";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export const useTrackInfo = () => {
    const spotifyApi = useSpotify();
    const trackId = useSelector(state => state.track.trackId);
    const [songInfo, setSongInfo] = useState();
    const [isLiked, setIsLiked] = useState(false);
    const { data: session } = useSession();

    const checkIfTrackIsSaved = async trackId => {
        return spotifyApi.containsMySavedTracks([trackId]).then(res => res.body[0]);
    };

    const updateIsLiked = async () => {
        if (session && session.user && trackId) {
            const isSaved = await checkIfTrackIsSaved(trackId);
            setIsLiked(isSaved);
        }
    };

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (trackId) {
                spotifyApi.getTrack(trackId).then(track => {
                    setSongInfo(track.body);
                });
                updateIsLiked();
            }
        };
        fetchSongInfo();
    }, [trackId, session]);

    return { songInfo, isLiked, updateIsLiked };
};

export default useTrackInfo;
