import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';

import { RandomRoutingModule } from './random-routing.module';
import { SwaggerComponent } from './swagger/swagger.component';

@NgModule({
  imports: [
    SharedModule,
    RandomRoutingModule
  ],
  declarations: [
    SwaggerComponent
  ]
})
export class RandomModule { }
