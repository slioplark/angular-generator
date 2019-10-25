import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.scss']
})
export class SwaggerComponent implements OnInit {

  codeMock: string;
  codeModel: string;
  codeService: string;

  form: FormGroup;
  swaggerObj: object;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      json: [null, [Validators.required]]
    });
  }

  onCreate() {
    this.swaggerObj = {};
    this.getSwaggerObj();
    this.genMockCode();
    this.genModelCode();
  }

  genMockCode() {
    this.codeMock = '';
    Object.keys(this.swaggerObj).forEach(mockKey => {

      // vo name
      this.codeMock += `
      export const ${mockKey}: ${mockKey} = {`;

      // prop name
      const prop = this.swaggerObj[mockKey];
      Object.keys(prop).forEach(propKey => {
        switch (prop[propKey].type) {
          case 'Date':
            this.codeMock += `
            ${propKey}: new Date('${prop[propKey].mock}'),`;
            break;
          case 'string':
            this.codeMock += `
            ${propKey}: '${prop[propKey].mock}',`;
            break;
          default:
            this.codeMock += `
            ${propKey}: ${prop[propKey].mock},`;
            break;
        }
      });

      // bracket end
      this.codeMock += `
      };
      `;

    });
  }

  genModelCode() {
    this.codeModel = '';
    Object.keys(this.swaggerObj).forEach(mockKey => {

      // vo name
      this.codeModel += `
      export interface ${mockKey} {`;

      // prop name
      const prop = this.swaggerObj[mockKey];
      Object.keys(prop).forEach(propKey => {
        if (prop[propKey].description) {
          this.codeModel += `
          ${propKey}: ${prop[propKey].type}; // ${prop[propKey].description.split('\n').join(' ').split('\r').join(' ')}`;
        } else {
          this.codeModel += `
          ${propKey}: ${prop[propKey].type};`;
        }
      });

      // bracket end
      this.codeModel += `
      }
      `;

    });
  }

  getSwaggerObj() {

    // swagger string
    const json = this.form.get('json').value;
    if (!json) { return; }

    // definition object
    const defObj = JSON.parse(json).definitions;
    Object.keys(defObj).forEach(defKey => {

      const typeObj = {};
      const propObj = defObj[defKey].properties;
      if (!propObj) { return; }

      // property object
      Object.keys(propObj).forEach(propKey => {

        const prop = propObj[propKey];
        if (!prop) { return; }

        // detail object
        switch (prop.type) {
          case 'array':
            const vo = prop.items.$ref ?
              prop.items.$ref.split('/').pop() : prop.items.type === 'string' ?
                'string' : prop.items.type === 'integer' ?
                  'number' : 'any';
            typeObj[propKey] = { type: `${vo}[]`, mock: '[]', description: prop.description };
            break;
          case 'string':
            typeObj[propKey] = { type: 'string', mock: propKey, description: prop.description };
            break;
          case 'integer':
            typeObj[propKey] = { type: 'number', mock: 0, description: prop.description };
            break;
          case 'number':
            typeObj[propKey] = { type: 'number', mock: 123, description: prop.description };
            break;
          case 'boolean':
            typeObj[propKey] = { type: 'boolean', mock: true, description: prop.description };
            break;
          default:
            typeObj[propKey] = { type: prop.type, mock: null, description: prop.description };
            break;
        }
        if (prop.format === 'date-time') {
          typeObj[propKey][`type`] = 'Date';
          typeObj[propKey][`mock`] = new Date();
        }
        if (prop.enum && prop.enum.length > 0) {
          typeObj[propKey][`enum`] = prop.enum;
          typeObj[propKey][`mock`] = prop.enum[0];
        }

      });

      this.swaggerObj[defKey] = typeObj;

    });

  }

}
