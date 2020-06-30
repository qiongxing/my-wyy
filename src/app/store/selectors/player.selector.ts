import { PlayerState } from "../reducers/plaer.reducer";
import { createSelector, createFeatureSelector } from '@ngrx/store';

const playerState = (state: PlayerState) => state;
// const selectPlayerStates = (state: PlayerState) => state;
export const getPlayer = createFeatureSelector<PlayerState>('player');
export const selectPlaying = createSelector(playerState, (state) => state.playing);
export const selectPlayMode = createSelector(playerState, (state) => state.playMode);
export const selectSongList = createSelector(playerState, (state) => state.songList);
export const selectPlayList = createSelector(playerState, (state) => state.playList);
export const selectCurrentIndex = createSelector(playerState, (state) => state.currentIndex);
export const selectCurrentSong = createSelector(playerState, ({ playList, currentIndex }: PlayerState) => playList[currentIndex]);