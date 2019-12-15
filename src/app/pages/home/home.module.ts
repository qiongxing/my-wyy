import { NgModule } from '@angular/core';


import { ShareModule } from 'src/app/share/share.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';
import { MemberCardComponent } from './components/member-card/member-card.component';


@NgModule({
  declarations: [HomeComponent, WyCarouselComponent, MemberCardComponent],
  imports: [
    ShareModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
