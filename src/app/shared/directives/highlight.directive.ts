import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import * as hljs from 'highlight.js';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnChanges {

  @Input() appHighlight: string;

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    if (this.appHighlight) {
      this.el.nativeElement.textContent = this.appHighlight;
      hljs.highlightBlock(this.el.nativeElement);
    }
  }

}
