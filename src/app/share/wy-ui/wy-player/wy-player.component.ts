import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Inject } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { selectSongList, selectPlayList, selectCurrentIndex, selectPlayMode, selectCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { setPlayList, setCurrentIndex, setPlayMode, setSongList } from 'src/app/store/actions/player.action';
import { Song } from 'src/app/types/common.model';
import { PlayMode } from './wy-player.model';
import { TimeHolder } from 'ng-zorro-antd/time-picker/time-holder';
import { SliderValue, NzModalService } from 'ng-zorro-antd';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { shuffle, findIndex } from 'src/app/utils/array';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { BatchActionsService } from 'src/app/store/batch-actions.service';

// type: 'loop' | 'random' | 'singleLoop',
// label: '循环' | '随机' | '单曲循环',
const modeTypes: PlayMode[] = [
  {
    type: 'loop',
    label: '循环',
  },
  {
    type: 'random',
    label: '随机',
  },
  {
    type: 'singleLoop',
    label: '单曲循环',
  },
]
@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
})
export class WyPlayerComponent implements OnInit {
  @ViewChild('audioEl', { static: true }) private audioEl: ElementRef;
  @ViewChild(WyPlayerPanelComponent, { static: false }) private playerPanel: WyPlayerPanelComponent;
  persent = 0;
  bufferPersent = 0;
  volume = 60;//播放音量
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  duration: number;//歌曲时长
  currentTime: number;//播放时间
  audio: HTMLAudioElement;
  playing: boolean = false;
  songReady: boolean = false;
  showVolumePanel: boolean = false;//是否展示音量控件
  showPanel = false;// 是否显示列表面板

  bindFlag: boolean = false;//默认点击部分不是音量控制面板
  currentMode: PlayMode;//播放模式
  modeCount = 0;//当前播放模式索引
  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document,
    private nzModalServe: NzModalService,
    private batchActionServe: BatchActionsService,
  ) {
    this.storeInit();
  }

  ngOnInit() {
    this.audio = this.audioEl.nativeElement;
  }
  private storeInit() {
    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(selectSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(selectPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(selectCurrentIndex)).subscribe(currentIndex => this.watchCurrentIndex(currentIndex));
    appStore$.pipe(select(selectPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(selectCurrentSong)).subscribe(song => this.watchCurrentSong(song));
  }
  watchCurrentSong(song: Song): void {
    console.log('播放歌曲', song)
    if (song) {
      this.currentSong = song;
      this.duration = song.dt / 1000;
    }
  }
  watchPlayMode(mode: PlayMode): void {
    this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (this.currentMode.type === 'random') {
        list = shuffle(this.songList);
      }
      this.updateCurrentIndex(list, this.currentSong)
      this.store$.dispatch(setPlayList({ playList: list }));
    }
  }
  /**更新当前歌曲 */
  private updateCurrentIndex(list: Song[], currentSong: Song) {
    const index = findIndex(list, currentSong);
    this.store$.dispatch(setCurrentIndex({ currentIndex: index }));
  }
  private watchList(list, type) {
    console.log('播放歌单', type, list);
    this[type] = list;
  }
  private watchCurrentIndex(index) {
    console.log('播放索引', index)
    this.currentIndex = index;
  }
  onCanplay() {
    this.songReady = true;
    this.play();
  }
  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : 'https://p1.music.126.net/AgJPVd9Ng489G-G_sY9JRw==/109951164605789897.jpg';
  }
  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
    this.persent = (this.currentTime / this.duration) * 100;
    const buffered = this.audio.buffered;
    if (buffered.length && this.bufferPersent < 100) {
      this.bufferPersent = (buffered.end(0) / this.duration) * 100;
    }
  }
  //播放/暂停
  onToggle() {
    if (!this.currentSong) {
      if (this.playList.length > 0) {
        this.store$.dispatch(setCurrentIndex({ currentIndex: 0 }));
        this.songReady = false;
      }
    } else {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }
    }
  }
  onPrev(index: number) {
    if (!this.songReady) return;
    const newIndex = index < 0 ? this.songList.length - 1 : index;
    this.updateIndex(newIndex);
  }
  onNext(index: number) {
    if (!this.songReady) return;
    const newIndex = index > this.songList.length - 1 ? 0 : index;
    this.updateIndex(newIndex);
  }
  onClickOutSide() {
    this.showVolumePanel = false;
    this.showPanel = false;
    this.bindFlag = false;
  }
  private updateIndex(newIndex: number) {
    this.store$.dispatch(setCurrentIndex({ currentIndex: newIndex }));
    this.songReady = false;
  }
  onPersentChange(value) {
    if (this.currentSong) {
      let currentTime = this.duration * (value / 100)
      this.audio.currentTime = currentTime;
      if (this.playerPanel) {
        this.playerPanel.seekLyric(currentTime * 1000);
      }
    }
  }
  onVolumeChange(value) {
    console.log('音量', value)
    this.audio.volume = value / 100;
  }
  //控制音量面板
  toggleVolPanel() {
    this.togglePanel('showVolumePanel');
  }
  toggleListPanel() {
    if (this.songList.length) {
      this.togglePanel('showPanel')
    }
  }
  togglePanel(type: string) {
    this[type] = !this[type];
    this.bindFlag = (this.showVolumePanel || this.showPanel)
  }
  onListPanelClose() {
    this.toggleListPanel();
  }
  //模式变更
  onChangeMode() {
    const temp = modeTypes[++this.modeCount % 3];
    console.log('播放模式', temp)
    this.store$.dispatch(setPlayMode({ playMode: temp }));
  }
  /**歌曲播放完比 */
  onEnded() {
    if (this.currentMode.type === 'singleLoop') {
      this.loop();
    } else {
      this.onNext(this.currentIndex + 1);
    }
  }
  //切换歌曲
  onChangeSong(song) {
    this.updateCurrentIndex(this.playList, song);
  }
  onDeleteSong(song: Song) {
    this.batchActionServe.deleteSong(song);
  }
  onClearSong() {
    this.nzModalServe.confirm({
      nzTitle: '确认情空列表',
      nzOnOk: () => {
        this.batchActionServe.clearSong();
      }
    })
  }
  private loop() {
    this.audio.currentTime = 0;
    this.audio.play();
    if (this.playerPanel) {
      this.playerPanel.seekLyric(0);
    }
  }
  private play() {
    this.audio.play();
    this.playing = true;
  }
}
