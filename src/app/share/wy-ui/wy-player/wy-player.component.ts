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
    this.currentSong = song;
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
}
