import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { Tab } from './tab.interface';
import { EXPERIENCE } from './experience';
import { Subscription } from 'rxjs';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  receivedTheme: any;
  private subscription: Subscription
  // themeService!: ThemeService

  constructor(private themeService: ThemeService) { 
    this.subscription = this.themeService.sharedData$.subscribe(data => {
    this.receivedTheme = data;
  });}

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
  // active = 0
  // Experience:any = EXPERIENCE;
  
  



}
  