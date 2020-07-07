import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Inject } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { selectSongList, selectPlayList, selectCurrentIndex, selectPlayMode, selectCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { setPlayList, setCurrentIndex } from 'src/app/store/actions/player.action';
import { Song } from 'src/app/types/common.model';
import { PlayMode } from './wy-player.model';
import { TimeHolder } from 'ng-zorro-antd/time-picker/time-holder';
import { SliderValue } from 'ng-zorro-antd';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
})
export class WyPlayerComponent implements OnInit {
  persent = 0;
  bufferPersent = 0;
  volume = 60;//播放音量
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  duration: number;//歌曲时长
  currentTime: number;//播放时间
  @ViewChild('audioEl', { static: true }) private audioEl: ElementRef;
  audio: HTMLAudioElement;
  playing: boolean = false;
  songReady: boolean = false;
  showVolumePanel: boolean = false;//是否展示音量控件
  selfClick: boolean = false;//默认点击部分不是音量控制面板
  winClick: Subscription;
  constructor(
    private store$: Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc: Document
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
    console.log('播放模式', mode)
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
    this.audio.play();
    this.playing = true;
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
    const newIndex = index >= this.songList.length - 1 ? 0 : index;
    this.updateIndex(newIndex);
  }

  private updateIndex(newIndex: number) {
    this.store$.dispatch(setCurrentIndex({ currentIndex: newIndex }));
    this.songReady = false;
  }
  onPersentChange(value) {
    if (this.currentSong) {
      this.audio.currentTime = this.duration * (value / 100);
    }
  }
  onVolumeChange(value) {
    console.log('音量', value)
    this.audio.volume = value / 100;
  }
  //控制音量面板
  toggleVolPanel(event: MouseEvent) {
    this.togglePanel();
  }
  togglePanel() {
    this.showVolumePanel = !this.showVolumePanel;
    if (this.showVolumePanel) {
      this.bindDocumentClickLister();
    } else {
      this.unbindDocumentClickLister();
    }
  }
  private bindDocumentClickLister() {
    if (!this.winClick) {
      this.winClick = fromEvent(this.doc, 'click').subscribe(() => {
        if (!this.selfClick) {//点击了控制器外的地方
          this.showVolumePanel = false;
          this.unbindDocumentClickLister();
        }
        this.selfClick = false;
      })
    }
  }
  private unbindDocumentClickLister() {
    this.winClick.unsubscribe();
    this.winClick = null;
  }
}
