import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Banner } from 'src/app/types/common.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  banners:Banner[];
  constructor(private homeSer: HomeService) {
    this.homeSer.getBanners().subscribe(banners => {
      this.banners=banners;
    });
  }

  ngOnInit() {
  }

}
