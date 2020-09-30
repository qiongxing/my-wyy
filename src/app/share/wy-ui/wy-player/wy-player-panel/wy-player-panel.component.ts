import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Song } from 'src/app/types/common.model';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { timer } from 'rxjs';
import { findIndex } from 'src/app/utils/array';
import { SongService } from 'src/app/services/song.service';
import { WyLyric, BaseLyricLine } from './wy-lyric';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less'],
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;
  @Input() playing: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @Output() onDeleteSong = new EventEmitter<Song>();
  @Output() onClearSong = new EventEmitter<void>();
  @Output() onToInfo = new EventEmitter<[string, number]>();
  @Output() onLikeSong = new EventEmitter<string>();
  @Output() onShareSong = new EventEmitter<Song>();
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  private lyric: WyLyric;
  private lyricRefs: NodeList;
  private startLine = 2;
  currentIndex: number;
  currentLineNum: number;
  scrollY: number = 0;
  currentLyric: BaseLyricLine[];
  constructor(
    private songSer: SongService
  ) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playing'] && !changes['playing'].firstChange) {
      if (this.lyric) {
        this.lyric.togglePlay(this.playing);
      }
    }
    if (changes['songList']) {
      console.log('播放歌单', this.songList)
      if (this.currentSong) {
        this.updateCurrentIndex();
      }
      // this.currentIndex = 0;
    }
    if (changes['currentSong']) {
      if (this.currentSong) {
        this.updateCurrentIndex();
        this.updateLyrics();
        if (this.show) {
          timer(80).subscribe(() => { this.scrollToCurrent(); })
        } else {
          // this.scrollToCurrent(0);
        }
      } else {
        this.resetLyric();
      }
    }
    if (changes['show'] && !changes['show'].firstChange && this.show) {
      this.wyScroll.first.refreshScroll();
      this.wyScroll.last.refreshScroll();
      if (this.currentSong) {
        timer(80).subscribe(() => {
          this.scrollToCurrent(0);
          if (this.lyricRefs) {
            this.scrollToCurrentLyric(0);
          }
        });

      }
    }
  }
  private updateLyrics() {
    this.resetLyric();
    this.songSer.getLyrics(this.currentSong.id).subscribe(res => {
      this.lyric = new WyLyric(res);
      this.currentLyric = this.lyric.lines;
      this.startLine = res.tlyric ? 1 : 3;
      this.handlerLyric();
      this.wyScroll.last.scrollTo(0, 0);

      if (this.playing) {
        this.lyric.play();
      }
    })
  }
  private resetLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = [];
      this.currentLineNum = 0;
      this.lyricRefs = null;
    }
  }
  private handlerLyric() {
    this.lyric.handler.subscribe(({ lineNum }) => {
      this.currentLineNum = lineNum;
      if (!this.lyricRefs) {
        this.lyricRefs = this.wyScroll.last.el.nativeElement.querySelectorAll('ul li');
        console.log('lyricRefs', this.lyricRefs)
      }
      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        if (lineNum > this.startLine) {
          this.scrollToCurrentLyric(300);
        } else {
          this.wyScroll.last.scrollTo(0, 0);
        }
      }
    })
  }
  private updateCurrentIndex() {
    this.currentIndex = findIndex(this.songList, this.currentSong);
  }

  private scrollToCurrent(speed = 300) {
    const songListRefs = this.wyScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = <HTMLElement>songListRefs[this.currentIndex || 0];
      const currentLiOffsetTop = currentLi.offsetTop;
      const currentLiOffsetHeight = currentLi.offsetHeight;
      if (((currentLiOffsetTop - Math.abs(this.scrollY)) > currentLiOffsetHeight * 5) || (currentLiOffsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, null, null);
      }
    }
  }
  private scrollToCurrentLyric(speed = 300) {
    const targetLine = this.lyricRefs[this.currentLineNum - this.startLine];
    if (targetLine) {
      this.wyScroll.last.scrollToElement(targetLine, speed, false, false);
    }
  }
  seekLyric(time: number) {
    if (this.lyric) {
      this.lyric.seek(time);
    }
  }
  toInfo(event: MouseEvent, path) {
    event.stopPropagation();
    this.onToInfo.emit(path)
  }

  likeSong(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.onLikeSong.emit(id);
  }
  shareSong(event: MouseEvent, song: Song) {
    event.stopPropagation();
    this.onShareSong.emit(song);
  }
}
