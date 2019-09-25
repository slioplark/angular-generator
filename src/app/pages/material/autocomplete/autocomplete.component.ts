import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  formName: string;
  autoName: string;

  code: string;
  codeHtml: string;
  codeTypescript: string;

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
    this.formName = this.form.get('column').value.trim();
    this.autoName = this.formName[0].toUpperCase() + this.formName.slice(1);
    this.getHtml();
    this.getTypescript();
  }

  onMouseChange(code: string) {
    this.code = code;
  }

  getHtml() {
    this.codeHtml = `
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

  getTypescript() {
    this.codeTypescript = `
    ${this.formName}List$: Observable<any>;
    `;

    this.codeTypescript += `
    get${this.autoName}List() {
      this.${this.formName}List$ = this.form.get('${this.formName}').value.valueChanges
        .pipe(
          startWith<string | any>(''),
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
        item.toLowerCase().indexOf(value.toLowerCase()) > 0);
    }
    `;
  }

}
