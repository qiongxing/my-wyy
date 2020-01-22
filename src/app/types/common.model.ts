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
    name: string;
    picUrl: string;
    playCount: number;
    tracks: Song[];
}
//歌手
export type Singer = {
    id: number;
    name: string;
    picUrl: string;
    albumSize: number;
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
    dt: string;
}