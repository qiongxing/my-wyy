import { NgModule, SkipSelf, Optional } from '@angular/core';
import { ShareModule } from '../share/share.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from '../services/services.module';
import { PagesModule } from '../pages/pages.module';
import { AppRoutingModule } from '../app-routing.module';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { AppStoreModule } from '../store';

@NgModule({
  declarations: [],
  imports: [
    ShareModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    AppStoreModule,
    AppRoutingModule,
  ],
  exports: [ShareModule, AppRoutingModule],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('core module 只供appModule使用')
    }
  }
}
