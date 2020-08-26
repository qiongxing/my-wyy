import { Injectable } from '@angular/core';
import { AppStoreModule } from '.';
import { Store, select } from '@ngrx/store';
import { getPlayer } from './selectors/player.selector';
import { PlayerState } from './reducers/plaer.reducer';
import { Song } from '../types/common.model';
import { setSongList, setPlayList, setCurrentIndex } from './actions/player.action';
import { shuffle, findIndex } from '../utils/array';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  /**所有状态数据 */
  private playState: PlayerState;
  constructor(
    private store$: Store<AppStoreModule>,
  ) {
    this.store$.pipe(select(getPlayer)).subscribe(res => {
      this.playState = res;
    })
  }
  selectPlayList({ list, index = 0 }: { list: Song[], index: number }) {
    this.store$.dispatch(setSongList({ songList: list }));
    let trueList = list.slice();
    let trueIndex = index;
    //随机模式时更改songList
    if (this.playState.playMode.type === 'random') {
      trueList = shuffle(trueList || []);
      trueIndex = findIndex(trueList, list[trueIndex])
    }
    this.store$.dispatch(setPlayList({ playList: trueList }));
    this.store$.dispatch(setCurrentIndex({ currentIndex: trueIndex }));
  }

  /**添加歌曲 */
  insertSong(song: Song, isPlay = false) {
    const songList = this.playState.songList.slice();
    const playList = this.playState.playList.slice();
    let insertIndex = this.playState.currentIndex;
    const pIndex = findIndex(playList, song);
    if (pIndex > -1) {
      //歌曲已经存在
      if (isPlay) {
        insertIndex = pIndex;
      }
    } else {
      songList.push(song);
      playList.push(song);
      if (isPlay) {
        insertIndex = songList.length - 1;
      }
      this.store$.dispatch(setSongList({ songList }));
      this.store$.dispatch(setPlayList({ playList }));
    }
    if (insertIndex !== this.playState.currentIndex) {
      this.store$.dispatch(setCurrentIndex({ currentIndex: insertIndex }));
    }
  }
  insertSongs(songs: Song[]) {
    const songList = this.playState.songList.slice();
    const playList = this.playState.playList.slice();
    songs.forEach(song => {
      const pIndex = findIndex(playList, song);
      if (pIndex === -1) {
        playList.push(song);
        songList.push(song);
      }
    })
    this.store$.dispatch(setSongList({ songList }));
    this.store$.dispatch(setPlayList({ playList }));
  }
  /**删除歌曲 */
  deleteSong(song: Song) {
    const songList = this.playState.songList.slice();
    const playList = this.playState.playList.slice();
    let currentIndex = this.playState.currentIndex;
    const pIndex = findIndex(playList, song);
    const sIndex = findIndex(songList, song);
    songList.splice(sIndex, 1);
    playList.splice(pIndex, 1);
    if (currentIndex > pIndex || currentIndex === playList.length) {
      currentIndex--;
    }
    this.store$.dispatch(setPlayList({ playList }));
    this.store$.dispatch(setSongList({ songList }));
    this.store$.dispatch(setCurrentIndex({ currentIndex }));
  }
  /**清空歌曲 */
  clearSong() {
    this.store$.dispatch(setPlayList({ playList: [] }));
    this.store$.dispatch(setSongList({ songList: [] }));
    this.store$.dispatch(setCurrentIndex({ currentIndex: -1 }));
  }
}
