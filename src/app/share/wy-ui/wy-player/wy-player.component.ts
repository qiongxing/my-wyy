import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { selectSongList, selectPlayList, selectCurrentIndex, selectPlayMode, selectCurrentSong, getPlayer } from 'src/app/store/selectors/player.selector';
import { setPlayList, setCurrentIndex } from 'src/app/store/actions/player.action';
import { Song } from 'src/app/types/common.model';
import { PlayMode } from './wy-player.model';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
})
export class WyPlayerComponent implements OnInit {
  wySliderValue = 35;
  bufferOffset = 70;
  songList: Song[];
  playList: Song[];
  currentIndex: number;
  currentSong: Song;
  duration: number;//歌曲时长
  currentTime: number;//播放时间
  @ViewChild('audioEl', { static: true }) private audioEl: ElementRef;
  audio: HTMLAudioElement;
  constructor(
    private store$: Store<AppStoreModule>
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
    this.audio.play();
  }
  get picUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : 'https://p1.music.126.net/AgJPVd9Ng489G-G_sY9JRw==/109951164605789897.jpg';
  }
  onTimeUpdate(e: Event) {
    this.currentTime = (<HTMLAudioElement>e.target).currentTime;
  }
}
