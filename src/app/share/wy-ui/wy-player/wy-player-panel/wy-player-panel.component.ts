import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Song } from 'src/app/types/common.model';
import { WyScrollComponent } from '../wy-scroll/wy-scroll.component';
import { timer } from 'rxjs';
import { findIndex } from 'src/app/utils/array';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less'],
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  currentIndex: number;
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  scrollY: number = 0;
  @ViewChildren(WyScrollComponent) private wyScroll: QueryList<WyScrollComponent>;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
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
        if (this.show) {
          timer(80).subscribe(() => { this.scrollToCurrent(); })
        } else {
          // this.scrollToCurrent(0);
        }
      } else {

      }
    }
    if (changes['show'] && !changes['show'].firstChange && this.show) {
      this.wyScroll.first.refreshScroll();
      if (this.currentSong) {
        timer(80).subscribe(() => { this.scrollToCurrent(0); })
      }
    }
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
      console.log(this.scrollY);
      console.log(currentLiOffsetTop);
      console.log(currentLiOffsetHeight);

      if (((currentLiOffsetTop - Math.abs(this.scrollY)) > currentLiOffsetHeight * 5) || (currentLiOffsetTop < Math.abs(this.scrollY))) {
        this.wyScroll.first.scrollToElement(currentLi, speed, null, null);
      }
    }
  }
}
