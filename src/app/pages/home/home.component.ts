import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner, HotTag, SongSheet, Singer } from 'src/app/types/common.model';
import { NzCarouselComponent } from 'ng-zorro-antd';
import { SingerService } from 'src/app/services/singer.service';

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
  constructor(private homeSer: HomeService, private singerService: SingerService) {
    this.getBanners();
    this.getHotTags();
    this.getPerosonalSheetList();
    this.getEnterSinger();
  }

  ngOnInit() {
  }
  //获取轮播图数据
  getBanners() {
    this.homeSer.getBanners().subscribe(banners => {
      this.banners = banners;
    });
  }
  //获取热门标签
  getHotTags() {
    this.homeSer.getHotTags().subscribe(hotTags => {
      this.hotTags = hotTags;
      console.log('热门标签', hotTags)
    });
  }
  //获取推荐歌单
  getPerosonalSheetList() {
    this.homeSer.getPerosonalSheetList().subscribe(perosonal => {
      this.songSheetList = perosonal;
      console.log('推荐歌单', perosonal)
    });
  }
  //获取歌手推荐
  getEnterSinger() {
    this.singerService.getEnterSinger().subscribe(singers => {
      this.singers = singers;
      console.log('推荐歌单', singers)
    });
  }
  onBeforeChange({ to }) {
    this.carouselIndex = to;
  }
  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
}
