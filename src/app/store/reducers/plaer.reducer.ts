import { PlayMode } from 'src/app/share/wy-ui/wy-player/wy-player.model';
import { Song } from 'src/app/types/common.model';
import { createReducer, on } from '@ngrx/store';
import { setPlaying, setPlayMode, setSongList, setPlayList, setCurrentIndex } from '../actions/player.action';

export type PlayerState = {
    //播放状态
    playing: boolean;
    //播放模式
    playMode: PlayMode;
    //歌单列表
    songList: Song[];
    //播放列表
    playList: Song[];
    //当前播放的索引
    currentIndex: number;
}

const initPlayerState: PlayerState = {
    playing: false,
    playMode: { type: 'loop', label: '循环' },
    songList: [],
    playList: [],
    currentIndex: -1
}

export const playerReducer = createReducer(initPlayerState,
    on(setPlaying, (state, { playing }) => ({ ...state, playing })),
    on(setPlayMode, (state, { playMode }) => ({ ...state, playMode })),
    on(setSongList, (state, { songList }) => ({ ...state, songList })),
    on(setPlayList, (state, { playList }) => ({ ...state, playList })),
    on(setCurrentIndex, (state, { currentIndex }) => ({ ...state, currentIndex }))
)