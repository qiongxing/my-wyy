import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/internal/operators';
import { SongSheet, Song, Singer } from 'src/app/types/common.model';
import { Observable, Subject } from 'rxjs';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { getPlayer, selectCurrentSong } from 'src/app/store/selectors/player.selector';
import { SongService } from 'src/app/services/song.service';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { MemberService } from 'src/app/services/member.service';
import { setShareInfo } from 'src/app/store/actions/member.action';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit, OnDestroy {
  private destory$ = new Subject<void>();

  sheetInfo: SongSheet;
  description = {
    short: '',
    long: '',
  }
  controlDesc = {
    isExpand: false,
    iconCls: 'down',
    label: '展开'
  }
  currentSong: Song;
  constructor(
    private route: ActivatedRoute,
    private store$: Store<AppStoreModule>,
    private songServe: SongService,
    private batchActionServe: BatchActionsService,
    private nzMessageServe: NzMessageService,
    private memberServe: MemberService
  ) {
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description)
      }
      this.listenCurrent();
    });
  }
  ngOnInit() {

  }

  private listenCurrent() {
    this.store$.pipe(select(getPlayer), select(selectCurrentSong), takeUntil(this.destory$)).subscribe(song => {
      this.currentSong = song;
    })
  }

  private changeDesc(description: string) {
    const str = this.replaceStr(`<b>介绍：</b >${description}`);
    if (description.length < 99) {
      this.description.short = str;
      this.description.long = '';
    } else {
      this.description = {
        short: str.slice(0, 99) + '...',
        long: str
      }
    }
  }
  private replaceStr(str: string) {
    return str.replace(/\n/g, '<br/>');
  }
  toggleDesc() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.iconCls = 'up';
      this.controlDesc.label = '收起';
    } else {
      this.controlDesc.iconCls = 'down';
      this.controlDesc.label = '展开';
    }
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
  onLikeSheet(id: string) {
    this.memberServe.likeSheet(id).subscribe(() => {
      this.alertMessage('success', '收藏成功');
    }, error => {
      this.alertMessage('error', error.msg || "收藏失败");
    })
  }

  /**分享歌单 */
  shareResource(resource: Song | SongSheet, type = "song") {
    let txt = "";
    if (type === "playlist") {
      txt = this.markTxt("歌单", resource.name, (<SongSheet>resource).creator.nickname);
    } else {
      txt = this.markTxt("歌曲", resource.name, (<Song>resource).ar);
    }
    this.store$.dispatch(setShareInfo({ info: { id: resource.id.toString(), type, txt } }));
  }
  private markTxt(type: string, name: string, makeBy: string | Singer[]): string {
    let makeByStr = "";
    if (Array.isArray(makeBy)) {
      makeByStr = makeBy.map(item => item.name).join("/");
    } else {
      makeByStr = makeBy;
    }
    return `${type} : ${name} -- ${makeByStr}`;
  }
  private alertMessage(type: string, msg: string) {
    this.nzMessageServe.create(type, msg);
  }
  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
