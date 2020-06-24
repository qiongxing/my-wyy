import { createAction, props } from '@ngrx/store';
import { PlayMode } from 'src/app/share/wy-ui/wy-player/wy-player.model';
import { Song } from 'src/app/types/common.model';

export const setPlaying = createAction('[player] SetPlaying', props<{ playing: boolean }>());
export const setPlayMode = createAction('[player] SetPlayMode', props<{ playMode: PlayMode }>());
export const setSongList = createAction('[player] Set Song List', props<{ songList: Song[] }>());
export const setPlayList = createAction('[player] Set Play List', props<{ playList: Song[] }>());
export const setCurrentIndex = createAction('[player] SetCurrentIndex', props<{ currentIndex: number }>());
export const setCurrentSong = createAction('[player] SetCurrentSong', props<{ currentSong: Song }>()); 