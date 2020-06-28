import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/types/common.model';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SheetService } from 'src/app/services/sheet.service';
import { Store } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { setPlayList, setSongList, setCurrentIndex } from 'src/app/store/actions/player.action';

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
    private router: ActivatedRoute,
    private sheetService: SheetService,
    private store$: Store<AppStoreModule>,
  ) {
    this.router.data.pipe(map(res => res.homeDatas)).subscribe(([banners, hotTags, perosonal, singers]) => {
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
    console.log(id);
    this.sheetService.playSheet(id).subscribe(list => {
      console.log('歌单详情', list);
      this.store$.dispatch(setSongList({ songList: list }));
      this.store$.dispatch(setPlayList({ playList: list }));
      this.store$.dispatch(setCurrentIndex({ currentIndex: 0 }));
    });
  }
}
