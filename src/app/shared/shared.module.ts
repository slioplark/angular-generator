import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule
  ]
})
export class SharedModule { }
