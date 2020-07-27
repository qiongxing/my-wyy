import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, AfterViewInit, OnChanges, ViewChild, ElementRef, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import BScroll from '@better-scroll/core'
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
import { timer } from 'rxjs';
BScroll.use(MouseWheel);
BScroll.use(ScrollBar);
@Component({
  selector: 'app-wy-scroll',
  template: `
    <div class='wy-scroll' #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll{width: 100%; height: 100%; overflow: hidden;}`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyScrollComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  @Input() data: any[];
  @Output() onScrollEnd = new EventEmitter<number>();
  private bs: BScroll;
  refreshDelay = 50;
  constructor(readonly el: ElementRef) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true
      },
      mouseWheel: {}
    });
    this.bs.on('scrollEnd', ({ y }) => { this.onScrollEnd.emit(y) })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      this.refreshScroll();
    }
  }
  private refresh() {
    this.bs.refresh();
  }

  refreshScroll() {
    timer(this.refreshDelay).subscribe(() => {
      this.refresh();
    });
  }
  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }
  // 滚动到指定的位置
  scrollTo(...args) {
    this.bs.scrollTo.apply(this.bs, args);
  }
}
