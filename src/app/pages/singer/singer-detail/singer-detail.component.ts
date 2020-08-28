import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SingerDetail, Song } from 'src/app/types/common.model';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { getPlayer, selectCurrentSong } from 'src/app/store/selectors/player.selector';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  private destory$ = new Subject<void>();
  singerDetail: SingerDetail;
  currentSong: Song;
  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService,
  ) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(res => {
      this.singerDetail = res;
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
  /**添加多手歌曲 */
  onAddSongs(songs: Song[], isPlay = false) {
    this.songServe.getSongList(songs)
      .subscribe(list => {
        if (list.length) {
          if (isPlay) {
            this.batchActionServe.selectPlayList({ list, index: 0 })
          }
          this.batchActionServe.insertSongs(list)
        }
      })
  }
  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
