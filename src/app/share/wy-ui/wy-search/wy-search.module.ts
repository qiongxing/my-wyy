import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WySearchRoutingModule } from './wy-search-routing.module';
import { WySearchComponent } from './wy-search.component';
import { NzIconModule, NzInputModule } from 'ng-zorro-antd';
import { OverlayModule } from '@angular/cdk/overlay';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';
import { PortalModule } from '@angular/cdk/portal';


@NgModule({
  entryComponents: [WySearchPanelComponent],
  declarations: [WySearchComponent, WySearchPanelComponent],
  imports: [
    CommonModule,
    WySearchRoutingModule,
    NzIconModule,
    NzInputModule,
    OverlayModule,
    PortalModule
  ],
  exports: [WySearchComponent]
})
export class WySearchModule { }
