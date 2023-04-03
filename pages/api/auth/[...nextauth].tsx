import spotifyApi, { LOGIN_URL } from "app/shared/lib/spotify";
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token: any) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);
        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
        console.log("Refreshed access token - ", refreshedToken);
        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        return {
            ...token,
            error: "refresh token error",
        };
    }
}
export default NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
            authorization: LOGIN_URL,
        }),
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/sign",
    },
    callbacks: {
        async jwt({ token, account, user }: any) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000,
                };
            }
            if (Date.now() < token.accessTokenExpires) {
                console.log("Access token is valid");
                return token;
            }
            console.log("Access token has expired");
            return await refreshAccessToken(token);
        },
        async session({ session, token }: any) {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            spotifyApi.setAccessToken(token.accessToken);
            const { body: user } = await spotifyApi.getMe();
            session.user.image = user.images;

            return session;
        },
    },
});
