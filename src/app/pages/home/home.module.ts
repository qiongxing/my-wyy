import { NgModule } from '@angular/core';


import { ShareModule } from 'src/app/share/share.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { WyCarouselComponent } from './components/wy-carousel/wy-carousel.component';
import { MemberCardComponent } from './components/member-card/member-card.component';
import { HomeResolverService } from './home-resolve.service';


@NgModule({
  declarations: [HomeComponent, WyCarouselComponent, MemberCardComponent],
  imports: [
    ShareModule,
    HomeRoutingModule
  ],
  providers: [HomeResolverService]
})
export class HomeModule { }
