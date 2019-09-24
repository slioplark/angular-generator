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
  formName: string;

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
    this.getHtml();
    this.getTypescript();
  }

  onMouseChange(code: string) {
    this.code = code;
  }

  getHtml() {
    this.codeHtml = `
    <form [formGroup]="form">

      <mat-form-field>
        <input matInput formControlName="${this.formName}">
      </mat-form-field>

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
        column: [null, [Validators.required]],
      });
    }
    `;
  }

}
