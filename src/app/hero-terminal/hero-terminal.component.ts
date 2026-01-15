import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-hero-terminal',
  templateUrl: './hero-terminal.component.html',
  styleUrls: ['./hero-terminal.component.scss']
})
export class HeroTerminalComponent {
  @ViewChild('terminal') terminalContainer!: ElementRef;

  constructor() { }

  ngAfterViewInit() {
  }
}
