import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { MaterialRoutingModule } from './material-routing.module';
import { TableComponent } from './table/table.component';

@NgModule({
  imports: [
    SharedModule,
    MaterialRoutingModule
  ],
  declarations: [
    TableComponent
  ]
})
export class MaterialModule { }
