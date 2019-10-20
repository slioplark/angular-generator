import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.scss']
})
export class SwaggerComponent implements OnInit {

  code: string;
  codeMock: string;
  codeModel: string;
  codeService: string;

  typeMock: object;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      json: [null, [Validators.required]]
    });
  }

  onCreate() {
    this.typeMock = {};
    this.getMockList();
    console.log(this.typeMock);
  }

  onMouseChange(code: string) {
    this.code = code;
  }

  getMockList() {

    // swagger string
    const json = this.form.get('json').value;
    if (!json) { return; }

    // definition object
    const defObj = JSON.parse(json).definitions;
    Object.keys(defObj).map(defKey => {
      const propObj = defObj[defKey].properties;
      const propMock = {};
      if (!propObj) { return; }

      // property object
      Object.keys(propObj).map(propKey => {
        const propModel = propObj[propKey];
        if (!propModel) { return; }

        // mock object
        switch (propModel.type) {
          case 'array':
            propMock[propKey] = [];
            break;
          case 'boolean':
            propMock[propKey] = true;
            break;
          case 'number':
          case 'integer':
            propMock[propKey] = (propModel.enum && propModel.enum.length > 0) ? propModel.enum[0] : 123;
            break;
          case 'string':
            propMock[propKey] = (propModel.format === 'date-time') ? new Date() : propKey;
            break;
          default:
            propMock[propKey] = null;
            break;
        }
      });
      this.typeMock[defKey] = propMock;
    });

  }

}

export class SwaggerVo {
  swagger?: any;
  info?: any;
  host?: any;
  basePath?: any;
  tags?: any;
  paths?: any;
  definitions?: { [key: string]: Definition };
}

export class Definition {
  type?: any;
  required?: any;
  properties?: { [key: string]: Property };
  title?: any;
  description?: any;
}

export class Property {
  type?: any;
  format?: any;
  description?: any;
  allowEmptyValue?: any;
}
