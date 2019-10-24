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

  mockObj: object;
  modelObj: object;
  serviceObj: object;

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
    this.mockObj = {};
    this.getMockList();
    console.log(this.mockObj);
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
      const typeObj = {};
      const propObj = defObj[defKey].properties;
      if (!propObj) { return; }

      // property object
      Object.keys(propObj).map(propKey => {
        const prop = propObj[propKey];
        if (!prop) { return; }

        // mock object
        switch (prop.type) {
          case 'array':
            typeObj[propKey] = { type: 'any[]', mock: [] };
            break;
          case 'string':
            typeObj[propKey] = (prop.format === 'date-time') ?
              { type: 'Date', mock: new Date() } :
              { type: 'string', mock: propKey };
            break;
          case 'number':
          case 'integer':
            typeObj[propKey] = (prop.enum && prop.enum.length > 0) ?
              { type: 'number', mock: prop.enum[0] } :
              { type: 'number', mock: 123 };
            break;
          case 'boolean':
            typeObj[propKey] = { type: 'boolean', mock: true };
            break;
          default:
            typeObj[propKey] = { type: prop.type, mock: null };
            break;
        }
      });
      this.mockObj[defKey] = typeObj;
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
