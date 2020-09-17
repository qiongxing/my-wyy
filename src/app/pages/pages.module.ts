import { NgModule } from '@angular/core';
import { ShareModule } from '../share/share.module';
import { HomeModule } from './home/home.module';
import { SheetListModule } from './sheet-list/sheet-list.module';
import { SheetInfoModule } from './sheet-info/sheet-info.module';
import { SongInfoModule } from './song-info/song-info.module';
import { SingerModule } from './singer/singer.module';
import { MemberModule } from './member/member.module';



@NgModule({
  declarations: [],
  imports: [
    ShareModule,
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule,
    SingerModule,
    MemberModule,
  ],
  exports: [
    HomeModule,
    SheetListModule,
    SheetInfoModule,
    SongInfoModule,
    SingerModule,
    MemberModule,
  ]
})
export class PagesModule { }
