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

  code: string;
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

  onMouseChange(code: string) {
    this.code = code;
  }

  genHtml() {
    // add mat-table
    this.codeHtml = `
    <mat-table [dataSource]="dataSource"${this.sort ? ' matSort' : ''}>
    `;

    // add checkbox
    if (this.checkbox) {
      this.codeHtml += `
      <!-- checkbox column -->
      <ng-container matColumnDef="index">
        <mat-header-cell *matHeaderCellDef${this.sort ? ' mat-sort-header' : ''}>
          <mat-checkbox (change)="$event ? masterToggle() : null"
                        [checked]="selection.hasValue() && isAllSelected()"
                        [indeterminate]="selection.hasValue() && !isAllSelected()">
          </mat-checkbox>
        </mat-header-cell>
        <mat-cell *matCellDef="let row">
          <mat-checkbox (click)="$event.stopPropagation()"
                        (change)="$event ? selection.toggle(row) : null"
                        [checked]="selection.isSelected(row)">
          </mat-checkbox>
        </mat-cell>
      </ng-container>
      `;
    }

    // add column
    this.columnList.forEach(item => {
      this.codeHtml += `
      <!-- ${item} column -->
      <ng-container matColumnDef="${item}">
        <mat-header-cell *matHeaderCellDef${this.sort ? ' mat-sort-header' : ''}>${item}</mat-header-cell>
        <mat-cell *matCellDef="let row">{{ row.${item} }}</mat-cell>
      </ng-container>
      `;
    });

    // add row
    this.codeHtml += `
      <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
    `;

    // add mat-table
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

    // add sort
    if (this.sort) {
      this.codeTypescript += `
    @ViewChild(MatSort) sort: MatSort;
      `;
    }

    // add paginator
    if (this.page) {
      this.codeTypescript += `
    @ViewChild(MatPaginator) paginator: MatPaginator;
      `;
    }

    // add selection
    if (this.checkbox) {
      this.codeTypescript += `
    selection = new SelectionModel<any>(true, []);
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

    // add isAllSelected & masterToggle method
    if (this.checkbox) {
      this.codeTypescript += `
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
      `;
      this.codeTypescript += `
    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }
      `;
    }

  }

}
