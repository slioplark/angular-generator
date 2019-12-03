import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormComponent } from './form/form.component';
import { TableComponent } from './table/table.component';
import { DialogComponent } from './dialog/dialog.component';

const routes: Routes = [
  { path: 'form', component: FormComponent },
  { path: 'table', component: TableComponent },
  { path: 'dialog', component: DialogComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialRoutingModule { }
