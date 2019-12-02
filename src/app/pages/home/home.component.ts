import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner } from 'src/app/types/common.model';
import { NzCarouselComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners: Banner[];
  carouselIndex = 0;
  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;
  constructor(private homeSer: HomeService) {
    this.getBanners();
    this.getHotTags();
    this.getPerosonalSheetList();
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
      // this.banners = banners;
      console.log('热门标签',hotTags)
    });
  }
  //获取推荐歌单
  getPerosonalSheetList() {
    this.homeSer.getPerosonalSheetList().subscribe(perosonal => {
      // this.banners = banners;
      console.log('推荐歌单',perosonal)
    });
  }
  onBeforeChange({ to }) {
    this.carouselIndex = to;
  }
  onChangeSlide(type: 'pre' | 'next') {
    this.nzCarousel[type]();
  }
}
