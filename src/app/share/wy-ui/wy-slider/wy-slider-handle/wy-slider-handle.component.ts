import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { WySliderStyle } from '../wy-slider-type';

@Component({
  selector: 'wy-slider-handle',
  template: `<div class='wy-slider-handle' [ngStyle]="style"></div>`,
  styles: []
})
export class WySliderHandleComponent implements OnInit, OnChanges {
  @Input() wyVertical = false;
  @Input() wyOffset: number;
  style: WySliderStyle = {};
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wyOffset']) {
      this.style[this.wyVertical ? 'bottom' : 'left'] = this.wyOffset + '%';
    }
  }
}
