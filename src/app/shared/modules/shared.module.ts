import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { HighlightDirective } from '../directives/highlight.directive';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    HighlightDirective
  ],
  exports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    HighlightDirective,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
