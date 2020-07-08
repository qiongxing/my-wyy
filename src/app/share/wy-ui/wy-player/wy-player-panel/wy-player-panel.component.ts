import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Song } from 'src/app/types/common.model';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less'],
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {
      console.log('播放歌单', this.songList)
    }
    if (changes['currentSong']) {
      console.log('正在播放的歌曲', this.currentSong)
    }
  }
}
