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
  mockObj: object;

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
    this.getMockObj();
    this.codeMock = this.genMockCode();
    this.codeModel = this.genModelCode();
    this.codeService = this.genServiceCode();
  }

  genServiceCode() {

    const json = this.form.get('json').value;
    if (!json) { return; }

    // path object
    let code = '';
    const pathObj = JSON.parse(json).paths;
    Object.keys(pathObj).forEach(pathKey => {

      const httpObj = pathObj[pathKey];
      Object.keys(httpObj).forEach(httpKey => {

        const vo = (httpKey === 'post' || 'put' || 'patch') ? ', {}' : '';
        const url = pathKey.replace(/\{/g, '${');

        const parm = [];
        if (httpObj[httpKey].parameters) {
          httpObj[httpKey].parameters.forEach(item => {
            if (item.in === 'path' || 'query') { parm.push(item.name); }
          });
        }

        code += `
        /**
         * ${httpObj[httpKey].summary}
         */
        ${httpObj[httpKey].operationId}(${parm ? parm.join(', ') : ''}): Observable<any> {
        return this.httpClient.${ httpKey} <any>(\`${url}\`${vo});
        }
        `;
      });

    });

    return code;

  }

  genMockCode() {

    let code = '';
    Object.keys(this.mockObj).forEach(mockKey => {

      // vo name
      code += `
      export const ${mockKey}: ${mockKey} = {`;

      // prop name
      const prop = this.mockObj[mockKey];
      Object.keys(prop).forEach(propKey => {
        switch (prop[propKey].type) {
          case 'Date':
            code += `
            ${propKey}: new Date('${prop[propKey].mock}'),`;
            break;
          case 'string':
            code += `
            ${propKey}: '${prop[propKey].mock}',`;
            break;
          default:
            code += `
            ${propKey}: ${prop[propKey].mock},`;
            break;
        }
      });

      // bracket end
      code += `
      };
      `;

    });

    return code;

  }

  genModelCode() {

    let code = '';
    const list = [];
    Object.keys(this.mockObj).forEach(mockKey => {

      // vo name
      code += `
      export interface ${mockKey} {`;

      // prop name
      const prop = this.mockObj[mockKey];
      Object.keys(prop).forEach(propKey => {

        const vo = propKey[0].toUpperCase() + propKey.slice(1);
        if (prop[propKey].enum) { list.push({ name: vo, type: prop[propKey].type, enum: prop[propKey].enum }); }

        const desc = (prop[propKey].desc) ? `// ${prop[propKey].desc.split('\n').join(' ').split('\r').join(' ')}` : '';
        const type = (prop[propKey].enum) ? `${vo}Enum` : `${prop[propKey].type}`;
        code += `
        ${propKey}: ${type}; ${desc}`;

      });

      // bracket end
      code += `
      }
      `;

    });

    list.forEach(item => {

      // vo name
      code += `
      export enum ${item.name}Enum {`;

      // prop name
      item.enum.forEach(element => {
        const value = (item.type === 'number') ? `${element}` : `'${element}'`;
        code += `
        _${element} = ${value},`;
      });

      // bracket end
      code += `
      }
      `;

    });

    return code;

  }

  getMockObj() {

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
        let vo = '';
        switch (prop.type) {
          case 'array':
            vo = (prop.items.$ref) ?
              prop.items.$ref.split('/').pop() : prop.items.type === 'string' ?
                'string' : prop.items.type === 'integer' ?
                  'number' : 'any';
            typeObj[propKey] = { type: `${vo}[]`, mock: '[]', desc: prop.description };
            break;
          case 'string':
            typeObj[propKey] = { type: 'string', mock: propKey, desc: prop.description };
            break;
          case 'integer':
            typeObj[propKey] = { type: 'number', mock: 0, desc: prop.description };
            break;
          case 'number':
            typeObj[propKey] = { type: 'number', mock: Math.floor(Math.random() * 899 + 100), desc: prop.description };
            break;
          case 'boolean':
            typeObj[propKey] = { type: 'boolean', mock: true, desc: prop.description };
            break;
          default:
            vo = (prop.$ref) ? prop.$ref.split('/').pop() : prop.type;
            typeObj[propKey] = { type: vo, mock: null, desc: prop.description };
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

      this.mockObj[defKey] = typeObj;

    });

  }

}
