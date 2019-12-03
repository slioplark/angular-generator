import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  sort = false;
  page = false;
  checkbox = false;

  code: string;
  codeHtml: string;
  codeTypescript: string;
  codeDialogHtml: string;
  codeDialogTypescript: string;

  form: FormGroup;

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

    // generator code
    this.genHtml();
    this.genTypescript();
    this.getDialogHtml();
    this.getDialogTypescript();

    // clear form value
    this.form.patchValue({ column: '' });
  }

  onMouseChange(code: string) {
    this.code = code;
  }

  genHtml() {
    this.codeHtml = `
    <button (click)="openExampleDialog()">Pick one</button>
    `;
  }

  genTypescript() {
    this.codeTypescript = `
    name: string;
    animal: string;

    constructor(public dialog: MatDialog) {}

    openExampleDialog() {

      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'example-dialog';
      dialogConfig.data = {
        name: this.name,
        animal: this.animal
      };

      let dialogRef = this.dialog.open(ExampleDialog, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });

    }
    `;
  }

  getDialogHtml() {
    this.codeDialogHtml = `
    <!-- 標題 -->
    <h2 mat-dialog-title>
      {{ name }}
    </h2>

    <!-- 內容 -->
    <mat-dialog-content>
      {{ animal }}
    </mat-dialog-content>

    <!-- 按鈕 -->
    <mat-dialog-actions>
      <button mat-button (click)="confirm()">Confirm</button>
      <button mat-button (click)="cancel()">Cancel</button>
    </mat-dialog-actions>
    `;
  }

  getDialogTypescript() {
    this.codeDialogTypescript = `
    get name() {
      return this.dialogData.name || '';
    }

    get animal() {
      return this.dialogData.animal || '';
    }

    constructor(
      @Inject(MAT_DIALOG_DATA) public dialogData: any,
      public dialogRef: MatDialogRef<ExampleDialog>
    ) { }

    confirm() {
      this.dialogRef.close({
        name: 'name',
        animal: 'animal'
      });
    }

    cancel() {
      this.dialogRef.close();
    }
    `;
  }

}
