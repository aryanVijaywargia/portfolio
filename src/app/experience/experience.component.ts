import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Tab } from './tab.interface';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']



})
export class ExperienceComponent implements OnInit {

  // constructor() { }

  ngOnInit(): void {
  }


  // @ViewChild('tabListElement', { static: false }) tabListElement!: ElementRef;

  // tabs: string[] = ['All', 'Frontend', 'Backend', 'Fullstack'];
  // activeTab = 0;
  // jobsData: { jobs: { title: string; company: string; range: string }[] }[] = [
  //   {
  //     jobs: [
  //       { title: 'Job 1', company: 'Company 1', range: 'Range 1' },
  //       { title: 'Job 2', company: 'Company 2', range: 'Range 2' },
  //       { title: 'Job 3', company: 'Company 3', range: 'Range 3' },
  //     ],
  //   },
  //   {
  //     jobs: [
  //       { title: 'Job 4', company: 'Company 4', range: 'Range 4' },
  //       { title: 'Job 5', company: 'Company 5', range: 'Range 5' },
  //     ],
  //   },
  //   {
  //     jobs: [
  //       { title: 'Job 6', company: 'Company 6', range: 'Range 6' },
  //       { title: 'Job 7', company: 'Company 7', range: 'Range 7' },
  //       { title: 'Job 8', company: 'Company 8', range: 'Range 8' },
  //     ],
  //   },
  //   {
  //     jobs: [
  //       { title: 'Job 9', company: 'Company 9', range: 'Range 9' },
  //       { title: 'Job 10', company: 'Company 10', range: 'Range 10' },
  //     ],
  //   },
  // ];

  // tabListWidth = 0;
  // tabHeight = 0;

  // ngOnInit() {
  //   this.tabListWidth = this.tabListElement.nativeElement.offsetWidth;
  //   this.tabHeight = this.tabListElement.nativeElement.offsetHeight;
  //   // this.initSR();
  // }

  // setActiveTab(index: number) {
  //   this.activeTab = index;
  // }

  // initSR() {
  //   // const { srConfig } = this;
  //   // sr.reveal(this.tabListElement.nativeElement.querySelectorAll('.tab-button'), srConfig());
  // }

  // values: string[] = ['Value 1', 'Value 2', 'Value 3', 'Value 4'];
  // activeValue: string = this.values[0];

  // switchValue(value: string): void {
  //   this.activeValue = value;
  // }



  // tabs: Tab[] = [
  //   {
  //     label: 'Tab 1',
  //     bullets: ['Bullet 1', 'Bullet 2', 'Bullet 3']
  //   },
  //   {
  //     label: 'Tab 2',
  //     bullets: ['Bullet 4', 'Bullet 5', 'Bullet 6']
  //   },
  //   {
  //     label: 'Tab 3',
  //     bullets: ['Bullet 7', 'Bullet 8', 'Bullet 9']
  //   }
  // ];

  // selectedTab!: Tab;

  // selectTab(tab: Tab) {
  //   this.selectedTab = tab;
  // }

  // selectedTabIndex = 0;
  // tabs = [
  //   { label: 'Tab 1', items: ['Item 1.1', 'Item 1.2', 'Item 1.3'] },
  //   { label: 'Tab 2', items: ['Item 2.1', 'Item 2.2', 'Item 2.3'] },
  //   { label: 'Tab 3', items: ['Item 3.1', 'Item 3.2', 'Item 3.3'] }
  // ];

  tabs: Tab[] = [
    { label: 'Tab 1', bullets: ['Bullet 1', 'Bullet 2', 'Bullet 3'], index: 0 },
    { label: 'Tab 2', bullets: ['Bullet A', 'Bullet B', 'Bullet C'], index: 1 },
    { label: 'Tab 3', bullets: ['Bullet X', 'Bullet Y', 'Bullet Z'], index: 2 }
  ];
  selectedTabIndex = 0;



}
  