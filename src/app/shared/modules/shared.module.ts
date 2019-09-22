import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { HighlightDirective } from '../directives/highlight.directive';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule
  ],
  declarations: [
    HighlightDirective
  ],
  exports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    HighlightDirective
  ]
})
export class SharedModule { }
