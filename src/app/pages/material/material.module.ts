import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TableComponent } from './table/table.component';
import { MaterialRoutingModule } from './material-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialRoutingModule
  ],
  declarations: [
    TableComponent
  ]
})
export class MaterialModule { }
