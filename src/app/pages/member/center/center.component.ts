import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/internal/Subject';
import { RecordVal, User, UserRecord, UserSheet } from 'src/app/services/data-types/member.type';
import { MemberService, RecordType } from 'src/app/services/member.service';
import { SheetService } from 'src/app/services/sheet.service';
import { SongService } from 'src/app/services/song.service';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { getPlayer, selectCurrentSong } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/types/common.model';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CenterComponent implements OnInit, OnDestroy {
  user: User;
  record: RecordVal[];
  userSheet: UserSheet;
  recordType = RecordType.weekData;
  currentSong: Song = null;
  currentIndex = -1;
  private destory$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private batchActionService: BatchActionsService,
    private memberServe: MemberService,
    private songServe: SongService,
    private nzMessageServe: NzMessageService,
    private store$: Store<AppStoreModule>,
    private cdr: ChangeDetectorRef,
  ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord, userSheet]) => {
      this.user = user;
      this.record = userRecord.slice(0, 10);
      this.userSheet = userSheet;
      this.listenCurrent();
    })
  }

  ngOnInit() {
  }

  private listenCurrent() {
    this.store$.pipe(select(getPlayer), select(selectCurrentSong), takeUntil(this.destory$)).subscribe(song => {
      this.currentSong = song;
    })
    this.cdr.markForCheck();
  }
  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(list => {
      this.batchActionService.selectPlayList({ list, index: 0 });
    });
  }

  onChangeType(type: RecordType) {
    if (this.recordType !== type) {
      this.recordType = type;
      this.memberServe.getUserRecord(this.user.profile.userId.toString(), type).subscribe(res => {
        this.record = res.slice(0, 10);
        this.cdr.markForCheck();
      })
    }
  }
  onAddSong([song, isPlay]) {
    if (!this.currentSong || this.currentSong.id != song.id) {
      this.songServe.getSongList(song)
        .subscribe(list => {
          if (list.length) {
            this.batchActionService.insertSong(list[0], isPlay)
          } else {
            this.nzMessageServe.create('wraning', '没有找到url！')
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
