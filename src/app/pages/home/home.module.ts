import { NgModule } from '@angular/core';


import { ShareModule } from 'src/app/share/share.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';


@NgModule({
  declarations: [HomeComponent, WyCarouselComponent],
  imports: [
    ShareModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
