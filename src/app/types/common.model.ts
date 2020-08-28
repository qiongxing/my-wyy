export type Banner = {
    targetId: number;
    url: string;
    imageUrl: string;
}

export type HotTag = {
    id: number;
    name: string;
    position: number;
}
//推荐歌单model
export type SongSheet = {
    id: number;
    userId: number;
    name: string;
    picUrl: string;
    coverImgUrl: string;
    playCount: number;
    tags: string[];
    createTime: number;
    creator: { nickname: string; avatarUrl: string };
    description: string;
    subscribedCount: number;
    shareCount: number;
    commentCount: number;
    subsribed: boolean;
    tracks: Song[];
}
//歌手
export type Singer = {
    id: number;
    name: string;
    picUrl: string;
    albumSize: number;
    alias: string[];
}

export type SingerDetail = {
    artist: Singer;
    hotSongs: Song[];
}

export type SongSheetDetail = {
    id: number;
    name: string;
}

//歌曲
export type Song = {
    id: number;
    name: string;
    ar: Singer[];//歌手
    al: { id: number; name: string; picUrl: string }//
    dt: number;
    url: string;
}
//歌曲地址
export type SongUrl = {
    id: number;
    url: string;
}
//歌曲地址
export type Lyrics = {
    lyric: string;//本身歌词
    // klyric: string;//韩文翻译歌词
    tlyric: string;//中文翻译歌词
}
export type SheetList = {
    playlists: SongSheet[];
    total: number;
}