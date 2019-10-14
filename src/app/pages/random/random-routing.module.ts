import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SwaggerComponent } from './swagger/swagger.component';

const routes: Routes = [
  { path: 'swagger', component: SwaggerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RandomRoutingModule { }
