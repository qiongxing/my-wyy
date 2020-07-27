import { Directive, Input, Output, EventEmitter, ElementRef, Renderer2, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[clickoutside]'
})
export class ClickoutsideDirective implements OnChanges {
  private handleClick: () => void;
  @Input() bindFlag = false;
  @Output() onClickOutSide = new EventEmitter<void>();
  constructor(
    private el: ElementRef,
    private rd: Renderer2,
    @Inject(DOCUMENT) private doc: Document
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bindFlag'] && !changes['bindFlag'].firstChange) {
      console.log(changes['bindFlag'])
      if (changes['bindFlag']) {
        this.handleClick = this.rd.listen(this.doc, 'click', evt => {
          const isContain = this.el.nativeElement.contains(evt.target);
          if (!isContain) {
            this.onClickOutSide.emit();
          }
        })
      } else {
        this.handleClick();
      }
    }
  }
}
