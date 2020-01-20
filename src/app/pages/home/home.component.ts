import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/types/common.model';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';

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
  constructor(private homeSer: HomeService, private singerService: SingerService, private router: ActivatedRoute) {
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
}
