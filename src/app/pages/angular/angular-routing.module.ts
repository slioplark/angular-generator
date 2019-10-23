import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LifeCycleComponent } from './life-cycle/life-cycle.component';

const routes: Routes = [
  { path: 'lifeCycle', component: LifeCycleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AngularRoutingModule { }
