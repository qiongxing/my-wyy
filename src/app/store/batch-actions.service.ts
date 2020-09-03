import { Injectable } from '@angular/core';
import { AppStoreModule } from '.';
import { Store, select } from '@ngrx/store';
import { getPlayer } from './selectors/player.selector';
import { PlayerState, CurrentActions } from './reducers/plaer.reducer';
import { Song } from '../types/common.model';
import { setSongList, setPlayList, setCurrentIndex, setCurrentAction } from './actions/player.action';
import { shuffle, findIndex } from '../utils/array';
import { getMember } from './selectors/member.selector';
import { MemberState, ModalTypes } from './reducers/member.reducer';
import { setModalType, setModalVisible } from './actions/member.action';

@Injectable({
  providedIn: AppStoreModule
})
export class BatchActionsService {
  /**所有状态数据 */
  private playState: PlayerState;
  private memberState: MemberState;
  constructor(
    private store$: Store<AppStoreModule>,
  ) {
    this.store$.pipe(select(getPlayer)).subscribe(res => {
      this.playState = res;
    })
    this.store$.pipe(select(getMember)).subscribe(res => {
      this.memberState = res;
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
    this.store$.dispatch(setCurrentAction({ currentAction: CurrentActions.Play }));
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
      this.store$.dispatch(setCurrentAction({ currentAction: CurrentActions.Play }));
    } else {
      this.store$.dispatch(setCurrentAction({ currentAction: CurrentActions.Add }));
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
    this.store$.dispatch(setCurrentAction({ currentAction: CurrentActions.Add }));
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
    this.store$.dispatch(setCurrentAction({ currentAction: CurrentActions.Delete }));
  }
  /**清空歌曲 */
  clearSong() {
    this.store$.dispatch(setPlayList({ playList: [] }));
    this.store$.dispatch(setSongList({ songList: [] }));
    this.store$.dispatch(setCurrentIndex({ currentIndex: -1 }));
    this.store$.dispatch(setCurrentAction({ currentAction: CurrentActions.Clear }));
  }

  /**会员弹窗显示隐藏/类型 */
  controlModal(visible = true, modalType = ModalTypes.Default) {
    this.store$.dispatch(setModalType({ modalType }));
    this.store$.dispatch(setModalVisible({ modalVisible: visible }));
  }
}
