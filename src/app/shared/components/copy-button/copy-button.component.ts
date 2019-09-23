import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss']
})
export class CopyButtonComponent implements OnInit, OnChanges {

  @Input() code: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.code) {
      // create element
      const element = document.createElement('textarea');
      element.value = this.code;

      // execute copy
      document.body.appendChild(element);
      element.select();
      document.execCommand('copy');
      document.body.removeChild(element);
    }
  }

}
