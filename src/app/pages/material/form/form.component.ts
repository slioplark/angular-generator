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
    this.formType = this.form.get('type').value;
    this.formName = this.form.get('name').value.trim();
    this.autoName = this.formName[0].toUpperCase() + this.formName.slice(1);
    this.getHtml();
    this.getTypescript();
  }

  onMouseChange(code: string) {
    this.code = code;
  }

  getHtml() {
    this.codeHtml = `
    <form [formGroup]="form">
    `;

    // input type
    if (this.formType === 'input') {
      this.codeHtml += `
      <mat-form-field>
        <input matInput formControlName="${this.formName}">
      </mat-form-field>
      `;
    }

    // select type
    if (this.formType === 'select') {
      this.codeHtml += `
      <mat-form-field>
        <mat-select formControlName="${this.formName}">
          <mat-option *ngFor="let item of ${this.formName}List" [value]="item">
            {{ item.name }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      `;
    }

    // datepicker type
    if (this.formType === 'datepicker') {
      this.codeHtml += `
      <mat-form-field>
        <input matInput [matDatepicker]="picker" formControlName="${this.formName}">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      `;
    }

    // autocomplete type
    if (this.formType === 'autocomplete') {
      this.codeHtml += `
      <mat-form-field>
        <input type="text" matInput formControlName="${this.formName}" [matAutocomplete]="auto${this.autoName}">
        <mat-autocomplete #auto${this.autoName}="matAutocomplete" [displayWith]="display${this.autoName}Fn">
          <mat-option *ngFor="let item of ${this.formName}List$ | async" [value]="item">
            {{ item.name }}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
      `;
    }

    this.codeHtml += `
    </form>
    `;
  }

  getTypescript() {
    this.codeTypescript = `
    form: FormGroup;

    constructor(
      private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
      this.form = this.formBuilder.group({
        ${this.formName}: [null, [Validators.required]],
      });
    }
    `;

    // autocomplete type
    if (this.formType === 'autocomplete') {
      this.codeTypescript += `
    get${this.autoName}List() {
      this.${this.formName}List$ = this.form.get('${this.formName}').valueChanges
        .pipe(
          startWith<string | any>(''),
          debounceTime(300),
          map(value => typeof value === 'string' ? value : value.name),
          map(value => this.filter(${this.formName}List, value))
        );
    }
      `;

      this.codeTypescript += `
    display${this.autoName}Fn(value?: any): string | undefined {
      return value ? value.name : undefined;
    }
      `;

      this.codeTypescript += `
    filter(list: any[], value: string): string[] {
      return this.list.filter(item =>
        item.toLowerCase().indexOf(value.toLowerCase()) >= 0);
    }
      `;
    }
  }

}
