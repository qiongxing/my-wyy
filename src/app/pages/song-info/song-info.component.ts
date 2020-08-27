import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Song } from 'src/app/types/common.model';
import { BaseLyricLine, WyLyric } from 'src/app/share/wy-ui/wy-player/wy-player-panel/wy-lyric';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { getPlayer, selectCurrentSong } from 'src/app/store/selectors/player.selector';

@Component({
  selector: 'app-song-info',
  templateUrl: './song-info.component.html',
  styleUrls: ['./song-info.component.less']
})
export class SongInfoComponent implements OnInit, OnDestroy {
  private destory$ = new Subject<void>();
  song: Song;
  lyric: BaseLyricLine[];
  currentSong: Song;
  controlLyric = {
    isExpand: false,
    iconCls: 'down',
    label: '展开'
  }
  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService,
  ) {
    this.route.data.pipe(map(res => res.songInfo)).subscribe(([song, lyric]) => {
      this.song = song;
      this.lyric = new WyLyric(lyric).lines;
      console.log('song,;yric', song, lyric)
      this.listenCurrent();
    })
  }

  ngOnInit() {
  }
  private listenCurrent() {
    this.store$.pipe(select(getPlayer), select(selectCurrentSong), takeUntil(this.destory$)).subscribe(song => {
      this.currentSong = song;
    })
  }
  /**添加一首歌曲 */
  onAddSong(song: Song, isPlay = false) {
    if (!this.currentSong || this.currentSong.id != song.id) {
      this.songServe.getSongList(song)
        .subscribe(list => {
          if (list.length) {
            this.batchActionServe.insertSong(list[0], isPlay)
          } else {
            this.nzMessageServe.create('wraning', '没有找到url！')
          }
        })
    }
  }
  toggleLyric() {
    this.controlLyric.isExpand = !this.controlLyric.isExpand;
    if (this.controlLyric.isExpand) {
      this.controlLyric.iconCls = 'up';
      this.controlLyric.label = '收起';
    } else {
      this.controlLyric.iconCls = 'down';
      this.controlLyric.label = '展开';
    }
  }
  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
