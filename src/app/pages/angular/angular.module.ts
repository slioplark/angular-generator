import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { AngularRoutingModule } from './angular-routing.module';
import { LifeCycleComponent } from './life-cycle/life-cycle.component';

@NgModule({
  imports: [
    SharedModule,
    AngularRoutingModule
  ],
  declarations: [
    LifeCycleComponent
  ]
})
export class AngularModule { }
