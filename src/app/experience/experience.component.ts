import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Tab } from './tab.interface';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  activeTab = 1;

  handleClick(event: MouseEvent) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const tabNum = parseInt(target.getAttribute('data-tab') || '', 10);
    if (!isNaN(tabNum)) {
      this.activeTab = tabNum;
    }
  }
  


}
  