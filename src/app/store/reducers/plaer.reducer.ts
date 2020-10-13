import { PlayMode } from 'src/app/share/wy-ui/wy-player/wy-player.model';
import { Song } from 'src/app/types/common.model';
import { Action, createReducer, on } from '@ngrx/store';
import { setPlaying, setPlayMode, setSongList, setPlayList, setCurrentIndex, setCurrentAction } from '../actions/player.action';

export enum CurrentActions {
    Add,
    Play,
    Delete,
    Clear,
    Other
}

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
    //当前操作
    currentAction: CurrentActions;
}

const initPlayerState: PlayerState = {
    playing: false,
    playMode: { type: 'loop', label: '循环' },
    songList: [],
    playList: [],
    currentIndex: -1,
    currentAction: CurrentActions.Other
}

const reducer = createReducer(
    initPlayerState,
    on(setPlaying, (state, { playing }) => ({ ...state, playing })),
    on(setPlayMode, (state, { playMode }) => ({ ...state, playMode })),
    on(setSongList, (state, { songList }) => ({ ...state, songList })),
    on(setPlayList, (state, { playList }) => ({ ...state, playList })),
    on(setCurrentIndex, (state, { currentIndex }) => ({ ...state, currentIndex })),
    on(setCurrentAction, (state, { currentAction }) => ({ ...state, currentAction })),
)

export function playerReducer(state: PlayerState, action: Action) {
    return reducer(state, action);
}