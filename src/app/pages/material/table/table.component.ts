import { Component, OnInit } from '@angular/core';
import * as hljs from 'highlight.js';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

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
    document.querySelectorAll('pre code').forEach((block) => {
      block.textContent = this.genCode;
      hljs.highlightBlock(block);
    });
  }

}
