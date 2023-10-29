export interface IImage {
    height?: number | undefined | null;
    url: string;
    width?: number | undefined | null;
}
export interface IArtist {
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}
export interface IAlbum {
    album_group: string;
    album_type: string;
    artists: IArtist[];
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: IImage[];
    is_playable: boolean;
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
}
export interface IPlaylist {
    collaborative: boolean;
    description: string | null;
    external_urls: {
        spotify: string;
    };
    followers?: {
        href: string | null;
        total: number;
    };
    href: string;
    id: string;
    images: IImage[];
    name: string;
    owner?:
        | {
              display_name: string | undefined;
              external_urls: {
                  spotify: string;
              };
              href: string;
              id: string;
              type: string;
              uri: string;
          }
        | any;
    primary_color?: null | string;
    public: boolean | null;
    snapshot_id: string;
    tracks: {
        href: string;
        items: ITrack[];
        limit: number;
        next: string | null;
        offset: number;
        previous: null | string;
        total: number;
    };
    type: string;
    uri: string;
}
export interface ITrack {
    album: IAlbum;
    artists: IArtist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    episode: boolean;
    explicit: boolean;
    external_ids: {
        isrc: string;
    };
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track: boolean;
    track_number: number;
    type: string;
    uri: string;
}
