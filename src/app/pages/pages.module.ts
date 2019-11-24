import { NgModule } from '@angular/core';
import { ShareModule } from '../share/share.module';
import { HomeModule } from './home/home.module';



@NgModule({
  declarations: [],
  imports: [
    ShareModule,
    HomeModule,
  ],
  exports:[
    HomeModule
  ]
})
export class PagesModule { }
