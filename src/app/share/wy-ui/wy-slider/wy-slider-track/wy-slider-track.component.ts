import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { WySliderStyle } from '../wy-slider-type';

@Component({
  selector: 'wy-slider-track',
  template: `<div class='wy-slider-track' [class.buffer]='wyBuffer' [ngStyle]="style"></div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderTrackComponent implements OnInit, OnChanges {

  @Input() wyVertical = false;
  @Input() wyLength: number;
  @Input() wyBuffer: true;
  style: WySliderStyle = {};
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wyLength']) {
      if (this.wyVertical) {
        this.style.height = this.wyLength + '%';
        this.style.width = null;
        this.style.left = null;
      } else {
        this.style.width = this.wyLength + '%';
        this.style.height = null;
        this.style.bottom = null;
      }
    }
  }
}
