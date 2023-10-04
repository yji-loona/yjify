/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
    experimental: {
        appDir: false,
    },
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    images: {
        domains: [
            "lastfm.freetls.fastly.net",
            "i.scdn.co",
            "p.scdn.co",
            "thisis-images.scdn.co",
            "dailymix-images.scdn.co",
            "thisis-images.spotifycdn.com",
            "image-cdn-ak.spotifycdn.com",
            "thisis-images.spotifycdn.com",
            "image-cdn-fa.spotifycdn.com",
        ],
    },
};
module.exports = nextConfig;
