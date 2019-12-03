import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  code: string;
  codeHtml: string;
  codeTypescript: string;

  form: FormGroup;
  formType: string;
  formName: string;
  autoName: string;
  columnList: Array<any> = [];

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      type: [null, [Validators.required]]
    });
    this.form.get('type').patchValue('select');
  }

  onCreate() {
    // push column name in array
    this.formType = this.form.get('type').value;
    this.formName = this.form.get('name').value.trim();
    this.autoName = this.formName[0].toUpperCase() + this.formName.slice(1);
    this.columnList.push({
      formType: this.formType,
      formName: this.formName,
      autoName: this.autoName
    });

    // generator code
    this.genHtml();
    this.genTypescript();

    // clear form value
    this.form.patchValue({ name: '' });
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
    this.codeHtml = `
    <form [formGroup]="form">
    `;

    this.columnList.forEach(item => {
      // input type
      if (item.formType === 'input') {
        this.codeHtml += this.getInputHtmlTemplate(item.formName);
      }

      // select type
      if (item.formType === 'select') {
        this.codeHtml += this.getSelectHtmlTemplate(item.formName);;
      }

      // autocomplete type
      if (item.formType === 'autocomplete') {
        this.codeHtml += this.getAutoHtmlTemplate(item.formName, item.autoName);
      }

      // datepicker type
      if (item.formType === 'datepicker') {
        this.codeHtml += this.getDatepickerHtmlTemplate(item.formName);
      }
    });

    this.codeHtml += `
    </form>
    `;
  }

  genTypescript() {
    this.codeTypescript = `
    form: FormGroup;

    constructor(
      private formBuilder: FormBuilder
    ) { }
    `;

    // form column list
    this.codeTypescript += `
    ngOnInit() {
      this.form = this.formBuilder.group({`;

    this.columnList.forEach(item => {
      this.codeTypescript += `
        ${item.formName}: [null, [Validators.required]],`;
    });

    this.codeTypescript += `
      });
    }
    `;

    // autocomplete type
    this.columnList.filter(item => item.formType === 'autocomplete').forEach((item, index) => {
      this.codeTypescript += this.getAutoTsTemplate(item.formName, item.autoName);
      if (index === this.columnList.length - 1) {
        this.codeTypescript += this.getFilterTsTemplate();
      }
    });
  }

  getInputHtmlTemplate(formName: string) {
    return `
    <!-- ${formName} column -->
    <mat-form-field>
      <input matInput formControlName="${formName}">
    </mat-form-field>
    `;
  }

  getSelectHtmlTemplate(formName: string) {
    return `
    <!-- ${formName} column -->
    <mat-form-field>
      <mat-select formControlName="${formName}">
        <mat-option *ngFor="let item of ${formName}List" [value]="item">
          {{ item?.name }}
        </mat-option>
      </mat-select>
    </mat-form-field>
    `;
  }

  getAutoHtmlTemplate(formName: string, autoName: string) {
    return `
    <!-- ${formName} column -->
    <mat-form-field>
      <input type="text" matInput formControlName="${formName}" [matAutocomplete]="auto${autoName}">
      <mat-autocomplete #auto${autoName}="matAutocomplete" [displayWith]="display${autoName}Fn">
        <mat-option *ngFor="let item of ${formName}List$ | async" [value]="item">
          {{ item?.name }}
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
    `;
  }

  getDatepickerHtmlTemplate(formName: string) {
    return `
    <!-- ${formName} column -->
    <mat-form-field>
      <input matInput [matDatepicker]="${formName}Picker" formControlName="${formName}">
      <mat-datepicker-toggle matSuffix [for]="${formName}Picker"></mat-datepicker-toggle>
      <mat-datepicker #${formName}Picker></mat-datepicker>
    </mat-form-field>
    `;
  }

  getAutoTsTemplate(formName: string, autoName: string) {
    return `
    display${autoName}Fn(value?: any): string | undefined {
      return value ? value.name : undefined;
    }

    get${autoName}List() {
      this.${formName}List$ = this.form.get('${formName}').valueChanges
        .pipe(
          startWith<string | any>(''),
          debounceTime(300),
          map(value => typeof value === 'string' ? value : value.name),
          map(value => this.filter(${formName}List, value))
        );
    }
    `;
  }

  getFilterTsTemplate() {
    return `
    filter(list: any[], value: string): string[] {
      if (!value) { return list; }
      return list.filter(item =>
        item.toLowerCase().indexOf(value.toLowerCase()) >= 0
      );
    }
    `;
  }

}

