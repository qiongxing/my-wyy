import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WySearchRoutingModule } from './wy-search-routing.module';
import { WySearchComponent } from './wy-search.component';
import { NzIconModule, NzInputModule } from 'ng-zorro-antd';
import { OverlayModule } from '@angular/cdk/overlay'


@NgModule({
  declarations: [WySearchComponent],
  imports: [
    CommonModule,
    WySearchRoutingModule,
    NzIconModule,
    NzInputModule,
    OverlayModule
  ],
  exports: [WySearchComponent]
})
export class WySearchModule { }
