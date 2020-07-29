import { NgModule } from '@angular/core';
import { ShareModule } from '../share/share.module';
import { HomeModule } from './home/home.module';
import { SheetListModule } from './sheet-list/sheet-list.module';



@NgModule({
  declarations: [],
  imports: [
    ShareModule,
    HomeModule,
    SheetListModule,
  ],
  exports: [
    HomeModule,
    SheetListModule,
  ]
})
export class PagesModule { }
