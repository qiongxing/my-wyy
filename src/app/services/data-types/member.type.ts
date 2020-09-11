import { Song, SongSheet } from 'src/app/types/common.model';


export interface Signin {
  code: number;
  point?: number;
  msg?: string;
}

export interface User {
  // 等级
  level?: number;
  //调用状态
  code?: number;
  //返回信息
  message?: string;
  // 听歌记录
  listenSongs?: number;

  profile: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    backgroundUrl: string;
    signature: string;

    // 性别
    gender: number;

    // 粉丝
    followeds: number;

    // 关注
    follows: number;

    // 动态
    eventCount: number;
  };
}


export interface RecordVal {
  playCount: number;
  score: number;
  song: Song;
}

type recordKeys = 'weekData' | 'allData';

export type UserRecord = {
  [key in recordKeys]: RecordVal[];
};

export interface UserSheet {
  self: SongSheet[];
  subscribed: SongSheet[];
}
