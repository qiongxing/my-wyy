import { Component, OnInit, ViewChild } from '@angular/core';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/types/common.model';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { getMember, selectUserId } from 'src/app/store/selectors/member.selector';
import { MemberService } from 'src/app/services/member.service';
import { User } from 'src/app/services/data-types/member.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners: Banner[];
  hotTags: HotTag[];
  songSheetList: SongSheet[];
  singers: Singer[];
  carouselIndex = 0;
  user: User = null;

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetService: SheetService,
    private batchActionService: BatchActionsService,
    private store$: Store<AppStoreModule>,
    private memberServe: MemberService,
  ) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, perosonal, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = perosonal;
      this.singers = singers;
    });
    this.store$.pipe(select(getMember), select(selectUserId)).subscribe(id => {
      if (id) {
        this.getUserDetail(id);
      } else {
        this.user = null;
      }
    })
  }

  ngOnInit() {
  }

  private getUserDetail(id) {
    this.memberServe.getUserDetail(id).subscribe(user => {
      this.user = user;
    });
  }

  onBeforeChange({ to }) {
    this.carouselIndex = to;
  }
  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
  onPlaySheet(id: number) {
    this.sheetService.playSheet(id).subscribe(list => {
      this.batchActionService.selectPlayList({ list, index: 0 });
    });
  }
  toInfo(id: number) {
    this.router.navigate(['/sheetInfo', id]);
  }

  openModal() {
    this.batchActionService.controlModal(true, ModalTypes.Default);
  }
}
