import { Component, OnInit, Input, TemplateRef, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, OnChanges, SimpleChanges, ViewContainerRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { SearchResult } from 'src/app/types/common.model';
import { isEmptyObject } from 'src/app/utils/tool';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { WySearchPanelComponent } from './wy-search-panel/wy-search-panel.component';


@Component({
  selector: 'app-wy-search',
  templateUrl: './wy-search.component.html',
  styles: []
})
export class WySearchComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() customView: TemplateRef<any>;
  @Input() searchResult: SearchResult;
  @Input() connectedRef: ElementRef;
  @Output() onSearch = new EventEmitter<string>();
  @ViewChild('nzInput', { static: false }) private nzInput: ElementRef;
  @ViewChild('search', { static: false }) private defaultRef: ElementRef;

  private overlayRef: OverlayRef;
  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
  ) { }



  ngOnInit() {
  }
  ngAfterViewInit(): void {
    fromEvent(this.nzInput.nativeElement, 'input').pipe(debounceTime(300), distinctUntilChanged(), pluck('target', 'value'))
      .subscribe((value: string) => {
        this.onSearch.emit(value);
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchResult'] && !changes['searchResult'].firstChange) {
      if (!isEmptyObject(this.searchResult)) {
        console.log('searchResult', this.searchResult)
        this.showOverlayPanel();
      } else {
        this.hideOverlayPanel();
      }
    }
  }

  onFocus() {
    if (this.searchResult && !isEmptyObject(this.searchResult)) {
      this.showOverlayPanel();
    }
  }

  onBlur() {
    this.hideOverlayPanel();
  }

  hideOverlayPanel() {
    //清除overlayDOM
    if (this.overlayRef && this.overlayRef.hasAttached) {
      this.overlayRef.dispose();
    }
  }
  showOverlayPanel() {
    this.hideOverlayPanel();
    const positionStrategy = this.overlay.position().flexibleConnectedTo(this.connectedRef || this.defaultRef)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      }]).withLockedPosition(true);
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    const panelPortal = new ComponentPortal(WySearchPanelComponent, this.viewContainerRef);
    const panelRef = this.overlayRef.attach(panelPortal);
    panelRef.instance.searchResult = this.searchResult;
    this.overlayRef.backdropClick().subscribe(res => {
      this.hideOverlayPanel();
    })
  }
}
