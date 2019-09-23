import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  sort = false;
  page = false;
  checkbox = false;

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

  onChange(event, option: string) {
    if (option === 'sort') { this.sort = event; }
    if (option === 'page') { this.page = event; }
    if (option === 'checkbox') { this.checkbox = event; }
    this.genHtml();
    this.genTypescript();
  }

  onDelete(column: string) {
    this.columnList = this.columnList.filter(item => item !== column);
    this.genHtml();
    this.genTypescript();
  }

  genHtml() {
    // add mat-table
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

    // add  mat-paginator
    if (this.page) {
      this.codeHtml += `
    <mat-paginator #paginator
      [pageSizeOptions]="[10, 20, 30]"
      [showFirstLastButtons]="true">
    </mat-paginator>
      `;
    }
  }

  genTypescript() {
    // set string empty
    this.codeTypescript = '';

    // add paginator
    if (this.page) {
      this.codeTypescript += `
    @ViewChild(MatPaginator) paginator: MatPaginator;
      `;
    }

    // add displayedColumns
    this.codeTypescript += `
    displayedColumns = [`;
    this.columnList.forEach(item => {
      this.codeTypescript += `
      '${item}',`;
    });
    this.codeTypescript += `
    ];
    `;

    // add dataSource
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
