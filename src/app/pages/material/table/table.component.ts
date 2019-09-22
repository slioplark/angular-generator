import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as hljs from 'highlight.js';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @ViewChild('highlight', { static: true }) highlight: ElementRef;

  genCode: string;
  inputValue: string;

  constructor() { }

  ngOnInit() {
  }

  generator() {
    this.genCode = '';
    const colList = this.inputValue ? this.inputValue.split(',').map(item => item.trim()) : [];
    colList.forEach(item => {
      this.genCode += `
      <!-- ${item} Column -->
      <ng-container matColumnDef="${item}">
        <mat-header-cell *matHeaderCellDef>${item}</mat-header-cell>
        <mat-cell *matCellDef="let row">{{ row.${item} }}</mat-cell>
      </ng-container>
      `;
    });
    this.highlight.nativeElement.textContent = this.genCode;
    hljs.highlightBlock(this.highlight.nativeElement);
  }

}
