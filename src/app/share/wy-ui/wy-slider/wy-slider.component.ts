import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ViewChild, Inject, Input, ChangeDetectorRef, OnDestroy, forwardRef, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WySliderMouseObserver, SliderValue } from './wy-slider-type';
import { fromEvent, Observable, merge, Subscription } from 'rxjs';
import { filter, tap, pluck, map, distinctUntilChanged, takeUntil } from 'rxjs/internal/operators';
import { sliderEvent, getElementOffset } from './wy-slider.helper';
import { inArray } from 'src/app/utils/array';
import { limitNumberInRange, getPercent } from 'src/app/utils/number';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'wy-slider',
  templateUrl: './wy-slider.component.html',
  styleUrls: ['./wy-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => WySliderComponent),
    multi: true
  }]
})
export class WySliderComponent implements OnInit, OnDestroy, ControlValueAccessor {

  private sliderDom: HTMLDivElement;
  @Input() wyVertical = false;
  @Input() wyMax = 100;
  @Input() wyMin = 0;
  @Input() bufferOffset: SliderValue = 0;
  @Output() wyOnAfterChange = new EventEmitter<SliderValue>();
  @ViewChild('wySlider', { static: true }) private wySlider: ElementRef;

  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  private dragStart_: Subscription;
  private dragMove_: Subscription;
  private dragEnd_: Subscription;
  private isDraging = false;
  value: SliderValue = null;
  offset: SliderValue = null;

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private cdr: ChangeDetectorRef,
  ) { }

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
    if (inArray(events, 'start') && this.dragStart$ && !this.dragStart_) {
      this.dragStart_ = this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$ && !this.dragMove_) {
      this.dragMove_ = this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$ && !this.dragEnd_) {
      this.dragEnd_ = this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }
  private unSubscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$ && this.dragStart_) {
      this.dragStart_.unsubscribe();
      this.dragStart_ = null;
    }
    if (inArray(events, 'move') && this.dragMove$ && this.dragMove_) {
      this.dragMove_.unsubscribe();
      this.dragMove_ = null;
    }
    if (inArray(events, 'end') && this.dragEnd$ && this.dragEnd_) {
      this.dragEnd_.unsubscribe();
      this.dragEnd_ = null;
    }
  }
  private onDragStart(position: number) {
    this.setValue(position);
    this.toggleDragMoving(true)
  }

  private onDragMove(position: number) {
    if (this.isDraging) {
      this.setValue(position);
      this.cdr.markForCheck();
    }
  }

  private onDragEnd() {
    this.toggleDragMoving(false);
    this.wyOnAfterChange.emit(this.value)
    this.cdr.markForCheck();
  }
  private setValue(position: SliderValue, neddCheck = false) {
    if (neddCheck) {
      if (this.isDraging) return;
      this.value = this.formatValue(position);
      this.updateTrackAndHandles();
    }
    else if (!this.valuesEqual(this.value, position)) {
      this.value = position;
      this.updateTrackAndHandles();
      this.onValueChange(this.value);
    }

  }
  private formatValue(value: SliderValue): SliderValue {
    let res = value;
    if (this.assertValueValid(value)) {
      res = this.wyMin;
    } else {
      res = limitNumberInRange(value, this.wyMin, this.wyMax);
    }
    return res;
  }
  private assertValueValid(value: SliderValue): boolean {
    return isNaN(value);
  }
  private valuesEqual(value: SliderValue, position: SliderValue): boolean {
    if (typeof value !== typeof position) {
      return false;
    }
    return value === position;
  }
  private updateTrackAndHandles() {
    this.offset = this.getValueToOffset(this.value);
    //dom改变后，需要进行变更检测
    this.cdr.markForCheck();
  }
  private getValueToOffset(value: SliderValue): number {
    return getPercent(value, this.wyMin, this.wyMax);
  }
  private toggleDragMoving(moveable: boolean) {
    this.isDraging = moveable;
    if (moveable) {
      this.subscribeDrag(['move', 'end']);
    } else {
      this.unSubscribeDrag(['move', 'end']);
    }
  }
  private onValueChange(value: SliderValue) { };
  private onTouch(value: SliderValue) { };
  writeValue(value: any): void {
    this.setValue(value);
  }
  registerOnChange(fn: (value: SliderValue) => void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  ngOnDestroy(): void {
    this.unSubscribeDrag();
  }
}
