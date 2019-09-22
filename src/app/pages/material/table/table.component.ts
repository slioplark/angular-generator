import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @ViewChild('highlight', { static: true }) highlight: ElementRef;

  codeHtml: string;
  codeTypescript: string;

  form: FormGroup;
  columnList: Array<string> = [];

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      column: [null, [Validators.required]],
    });
  }

  onCreate() {
    // push column name in array
    const column = this.form.get('column').value;
    this.columnList.push(column.trim());
    this.genHtml();
    this.genTypescript();

    // clear form value
    this.form.patchValue({ column: '' });
  }

  onDelete(column: string) {
    this.columnList = this.columnList.filter(item => item !== column);
    this.genHtml();
    this.genTypescript();
  }

  genHtml() {
    this.codeHtml = `
    <mat-table [dataSource]="dataSource">
    `;
    this.columnList.forEach(item => {
      this.codeHtml += `
      <!-- ${item} Column -->
      <ng-container matColumnDef="${item}">
        <mat-header-cell *matHeaderCellDef>${item}</mat-header-cell>
        <mat-cell *matCellDef="let row">{{ row.${item} }}</mat-cell>
      </ng-container>
      `;
    });
    this.codeHtml += `
    </mat-table>
    `;
  }

  genTypescript() {
    this.codeTypescript = `
    displayedColumns = [`;
    this.columnList.forEach(item => {
      this.codeTypescript += `
      '${item}',`;
    });
    this.codeTypescript += `
    ];
    `;
    this.codeTypescript += `
    dataSource = new MatTableDataSource<any>();
    `;
    this.codeTypescript += `
    ngOnInit() {
      this.dataSource.data = data;
    }
    `;
  }

}
