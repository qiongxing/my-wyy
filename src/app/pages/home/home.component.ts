import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/types/common.model';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { setPlayList, setSongList, setCurrentIndex } from 'src/app/store/actions/player.action';
import { PlayerState } from 'src/app/store/reducers/plaer.reducer';
import { getPlayer } from 'src/app/store/selectors/player.selector';
import { shuffle, findIndex } from 'src/app/utils/array';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

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

  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sheetService: SheetService,
    private batchActionService: BatchActionsService,
  ) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, perosonal, singers]) => {
      this.banners = banners;
      this.hotTags = hotTags;
      this.songSheetList = perosonal;
      this.singers = singers;
    });

  }

  ngOnInit() {
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
