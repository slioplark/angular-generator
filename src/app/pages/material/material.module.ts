import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { DialogComponent } from './dialog/dialog.component';
import { FormComponent } from './form/form.component';
import { MaterialRoutingModule } from './material-routing.module';
import { TableComponent } from './table/table.component';

@NgModule({
  imports: [
    SharedModule,
    MaterialRoutingModule
  ],
  declarations: [
    FormComponent,
    TableComponent,
    DialogComponent
  ]
})
export class MaterialModule { }
