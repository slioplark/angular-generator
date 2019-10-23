import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-life-cycle',
  templateUrl: './life-cycle.component.html',
  styleUrls: ['./life-cycle.component.scss']
})
export class LifeCycleComponent implements OnInit {

  codeTypescript: string;

  constructor() { }

  ngOnInit() {
    this.genTypescript();
  }

  genTypescript() {
    this.codeTypescript = `
    export class LifeCycleComponent implements OnChanges,
                                               OnInit, DoCheck,
                                               AfterContentInit, AfterContentChecked,
                                               AfterViewInit, AfterViewChecked,
                                               OnDestroy {
    `;
    this.codeTypescript += `
      ngOnChanges(changes: SimpleChanges) {
        console.log('OnChanges');
      }
    `;
    this.codeTypescript += `
      ngOnInit() {
        console.log('OnInit');
      }
    `;
    this.codeTypescript += `
      ngDoCheck() {
        console.log('DoCheck');
      }
    `;
    this.codeTypescript += `
      ngAfterContentInit() {
        console.log('AfterContentInit');
      }
    `;
    this.codeTypescript += `
      ngAfterContentChecked () {
        console.log('AfterContentChecked');
      }
    `;
    this.codeTypescript += `
      ngAfterViewInit() {
        console.log('AfterViewInit');
      }
    `;
    this.codeTypescript += `
      ngAfterViewChecked() {
        console.log('AfterViewChecked');
      }
    `;
    this.codeTypescript += `
      ngOnDestroy() {
        console.log('OnDestroy');
      }
    `;
    this.codeTypescript += `
    }
    `;
  }

}
