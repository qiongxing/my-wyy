import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WySliderComponent } from './wy-slider.component';
import { WySliderTrackComponent } from './wy-slider-track/wy-slider-track.component';
import { WySliderHandleComponent } from './wy-slider-handle/wy-slider-handle.component';



@NgModule({
  declarations: [WySliderComponent, WySliderTrackComponent, WySliderHandleComponent],
  imports: [
    CommonModule
  ],
  exports: [WySliderComponent]
})
export class WySliderModule { }
