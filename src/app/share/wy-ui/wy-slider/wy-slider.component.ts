import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WySliderMouseObserver } from './wy-slider-type';
import { fromEvent, Observable, merge } from 'rxjs';
import { filter, tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { sliderEvent, getElementOffset } from './wy-slider.helper';
import { inArray } from 'src/app/utils/array';
import { limitNumberInRange } from 'src/app/utils/number';

@Component({
  selector: 'wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WySliderComponent implements OnInit {
  private sliderDom: HTMLDivElement;
  @Input() wyVertical = false;
  @Input() wyMax = 100;
  @Input() wyMin = 0;
  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  constructor(@Inject(DOCUMENT) private doc: Document) { }

  ngOnInit() {
    this.sliderDom = this.wySlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }
  createDraggingObservables() {
    const orientField = this.wyVertical ? 'pageY' : 'pageX';
    const mouse: WySliderMouseObserver = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filter: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };
    const touch: WySliderMouseObserver = {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      filter: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };
    [mouse, touch].forEach(source => {
      const { start, move, end, filter: filterFunc, pluckKey } = source;
      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        map((position: number) => this.findClosestValue(position))
      )
      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.sliderDom, move).pipe(
        filter(filterFunc),
        tap(sliderEvent),
        pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)
      )
    })
    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
  }
  /**将滑块位置转换为自己想要的百分比数据 */
  private findClosestValue(position: number): number {
    //获取滑块总长
    const siderLength = this.getWySliderLength();
    //获取滑块（上，左）坐标
    const siderStartPosition = this.getWySilderStartPosition();
    const radio = limitNumberInRange((position - siderStartPosition) / siderLength, 0, 1);
    const radioTrue = this.wyVertical ? 1 - radio : radio;
    return radioTrue * (this.wyMax - this.wyMin) + this.wyMin;
  }
  private getWySilderStartPosition() {
    const offset = getElementOffset(this.sliderDom);
    return this.wyVertical ? offset.top : offset.left;
  }
  private getWySliderLength(): number {
    return this.wyVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }
  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'start') && this.dragMove$) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'start') && this.dragEnd$) {
      this.dragEnd$.subscribe(this.onDragStart.bind(this));
    }
  }
  private onDragStart(position: number) {

  }
  private onDragMove(position: number) {

  }
}
