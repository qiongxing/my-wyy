import { NgModule } from '@angular/core';

import { SingerRoutingModule } from './singer-routing.module';
import { SingerDetailComponent } from './singer-detail/singer-detail.component';
import { ShareModule } from 'src/app/share/share.module';


@NgModule({
  declarations: [SingerDetailComponent],
  imports: [
    ShareModule,
    SingerRoutingModule
  ]
})
export class SingerModule { }
