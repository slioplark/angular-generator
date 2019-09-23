import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { MaterialRoutingModule } from './material-routing.module';
import { TableComponent } from './table/table.component';

@NgModule({
  imports: [
    SharedModule,
    MaterialRoutingModule
  ],
  declarations: [
    AutocompleteComponent,
    TableComponent
  ]
})
export class MaterialModule { }
