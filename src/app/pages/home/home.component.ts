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
  playState: PlayerState;
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
    this.store$.pipe(select(getPlayer)).subscribe(res => {
      this.playState = res
    })
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
      this.store$.dispatch(setSongList({ songList: list }));
      let trueList = list.slice();
      let trueIndex = 0;
      //随机模式时更改songList
      if (this.playState.playMode.type === 'random') {
        trueList = shuffle(trueList || []);
        trueIndex = findIndex(trueList, list[trueIndex])
      }
      this.store$.dispatch(setPlayList({ playList: trueList }));
      this.store$.dispatch(setCurrentIndex({ currentIndex: trueIndex }));
    });
  }
}
