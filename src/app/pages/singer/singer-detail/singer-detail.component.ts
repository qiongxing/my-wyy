import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Singer, SingerDetail, Song } from 'src/app/types/common.model';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { getPlayer, selectCurrentSong } from 'src/app/store/selectors/player.selector';
import { Subject } from 'rxjs/internal/Subject';
import { setShareInfo } from 'src/app/store/actions/member.action';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-singer-detail',
  templateUrl: './singer-detail.component.html',
  styleUrls: ['./singer-detail.component.less']
})
export class SingerDetailComponent implements OnInit, OnDestroy {
  private destory$ = new Subject<void>();
  singerDetail: SingerDetail;
  currentSong: Song;
  simiSingers: Singer[];
  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService,
    private memberServe: MemberService,
  ) {
    this.route.data.pipe(map(res => res.singerDetail)).subscribe(([detail, simiSingers]) => {
      this.singerDetail = detail;
      this.simiSingers = simiSingers;
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

  /**收藏歌曲 */
  onLikeSong(id: string) {
    this.batchActionServe.likeSong(id);
  }

  /**批量收藏 */
  onLikeSongs(songs: Song[]) {
    const ids = songs.map(song => song.id).join(",");
    this.onLikeSong(ids)
  }

  /**收藏歌手 */
  onLikeSinger(id: string) {
    let typeInfo = {
      type: 1,
      msg: "收藏"
    };
    if (this.singerDetail.artist.followed) {
      typeInfo = {
        type: 2,
        msg: "取消收藏"
      }
    }
    this.memberServe.likeSinger(id, typeInfo.type).subscribe(() => {
      this.singerDetail.artist.followed = !this.singerDetail.artist.followed;
      this.nzMessageServe.create('success', typeInfo.msg + "成功");
    }, err => {
      this.nzMessageServe.create('error', err.msg || typeInfo.msg + "失败");
    })
  }

  /**分享歌单 */
  onShareSong(resource: Song, type = "song") {
    let txt = this.markTxt("歌曲", resource.name, (<Song>resource).ar);
    this.store$.dispatch(setShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }
  private markTxt(type: string, name: string, makeBy: Singer[]): string {
    let makeByStr = makeBy.map(item => item.name).join("/");
    return `${type} : ${name} -- ${makeByStr}`;
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
