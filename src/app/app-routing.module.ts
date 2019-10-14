import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: 'material', loadChildren: () => import('./pages/material/material.module').then(m => m.MaterialModule) },
  { path: 'random', loadChildren: () => import('./pages/random/random.module').then(m => m.RandomModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
