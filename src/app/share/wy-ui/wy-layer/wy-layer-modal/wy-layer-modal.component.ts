import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, ViewChild, AfterViewInit, Inject, Renderer2, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';
import { Overlay, OverlayRef, OverlayKeyboardDispatcher, BlockScrollStrategy, OverlayContainer } from '@angular/cdk/overlay'
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { ESCAPE } from "@angular/cdk/keycodes";
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'src/app/services/services.module';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger('showHide', [
    state('show', style({ transform: 'scale(1)', opacity: '1' })),
    state('hide', style({ transform: 'scale(0)', opacity: '0' })),
    transition('show<=>hide', animate('0.1s'))
  ])]
})
export class WyLayerModalComponent implements OnInit, AfterViewInit, OnChanges {
  showModal = "hide";
  @Input() currentModalType = ModalTypes.Default;
  @ViewChild('modalContainer', { static: false }) private modalRef: ElementRef
  @Output() onLoadMySheet = new EventEmitter<void>();
  @Input() visible = false;
  private overlayRef: OverlayRef;
  private scrollStrategy: BlockScrollStrategy;
  private resizeHandle: () => void;
  private overlayContainer: HTMLElement;
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    @Inject(WINDOW) private win: any,
    private overlay: Overlay,
    private elementRef: ElementRef,
    private overlaykeyboardDispatcher: OverlayKeyboardDispatcher,
    private cdr: ChangeDetectorRef,
    private batchActionsServe: BatchActionsService,
    private rd: Renderer2,
    private overlayContainerSer: OverlayContainer,
  ) {
    this.scrollStrategy = this.overlay.scrollStrategies.block();
  }

  ngOnInit() {
    this.createOverlay()
  }
  ngAfterViewInit(): void {
    this.overlayContainer = this.overlayContainerSer.getContainerElement();
    this.listenResizeToCenter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["visible"] && !changes["visible"].firstChange) {
      this.handleVisibleChange(this.visible);
    }
  }

  private listenResizeToCenter() {
    const modal = this.modalRef.nativeElement;
    const modalSize = this.getHideDomSize(modal);
    this.keepCenter(modal, modalSize);
    this.resizeHandle = this.rd.listen('window', 'resize', () => this.keepCenter(modal, modalSize));
  }

  private keepCenter(modal: HTMLElement, modalSize: { w: number; h: number; }) {
    const left = (this.getWindowSize().w - modalSize.w) / 2;
    const top = (this.getWindowSize().h - modalSize.h) / 2;
    modal.style.left = left + 'px';
    modal.style.top = top + 'px';

  }
  getWindowSize() {
    return {
      w: this.win.innerWidth || this.doc.documentElement.clientWidth || this.doc.body.offsetWidth,
      h: this.win.innerHeight || this.doc.documentElement.clientHeight || this.doc.body.offsetHeight,
    }
  }
  private getHideDomSize(dom: HTMLElement) {
    return {
      w: dom.offsetWidth,
      h: dom.offsetHeight
    }
  }
  private createOverlay() {
    this.overlayRef = this.overlay.create();
    this.overlayRef.overlayElement.appendChild(this.elementRef.nativeElement);
    this.overlayRef.keydownEvents().subscribe(e => this.keydownListener(e))
  }

  /**监听键盘事件 */
  private keydownListener(evt: KeyboardEvent) {
    if (evt.keyCode === ESCAPE) {
      this.hide();
    }
  }
  private handleVisibleChange(visib) {
    this.showModal = visib ? "show" : "hide";
    if (visib) {
      this.scrollStrategy.enable();
      this.overlaykeyboardDispatcher.add(this.overlayRef);
      this.listenResizeToCenter();
      this.changePointerEvents('auto');
    } else {
      this.scrollStrategy.disable();
      this.overlaykeyboardDispatcher.remove(this.overlayRef);
      this.resizeHandle();
      this.changePointerEvents('none');
    }
    this.cdr.markForCheck();
  }
  private changePointerEvents(type: 'none' | 'auto') {
    if (this.overlayContainer) {
      this.overlayContainer.style.pointerEvents = type;
    }
  }
  /**隐藏弹出层 */
  hide() {
    this.batchActionsServe.controlModal(false)
  }
}
