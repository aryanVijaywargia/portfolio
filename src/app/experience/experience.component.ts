import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
// import { Tab } from './tab.interface';
import { EXPERIENCE } from './experience';
import { Subscription } from 'rxjs';
import { ThemeService } from '../theme.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  receivedTheme: any;
  private subscription: Subscription
  // themeService!: ThemeService

  constructor(private route: ActivatedRoute, private themeService: ThemeService, private elRef: ElementRef, private renderer: Renderer2) { 
    this.subscription = this.themeService.sharedData$.subscribe(data => {
    this.receivedTheme = data;
  });
}

ngAfterViewInit(){
  // this.setHighlighterWidth();

}

@HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth < 768) { // Adjust the threshold based on your requirements
      this.setHighlighterWidth();
    }
    else{
      const highlighterElement = this.elRef.nativeElement.querySelector('.highlighter');
      this.renderer.setStyle(highlighterElement, 'width', `2px`);
    }
  }


setHighlighterWidth() {
  const tabsElement = this.elRef.nativeElement.querySelector('.tabs');
  const tabElement = this.elRef.nativeElement.querySelector('.tab');

  if (tabsElement && tabElement) {
    const tabsWidth = tabsElement.offsetWidth;
    const tabWidth = tabElement.offsetWidth;

    const highlighterWidth = tabWidth  ; // Adjust numberOfTabs according to your actual number of tabs

    // Now, you can use highlighterWidth to set the width of the highlighter
    const highlighterElement = this.elRef.nativeElement.querySelector('.highlighter');
    if (highlighterElement) {
      this.renderer.setStyle(highlighterElement, 'width', `${highlighterWidth}px`);
    }
  }
}


  ngOnInit(): void {
    this.onResize();

    // this.route.fragment.subscribe((fragment: string | null) => {
    //   if (fragment) {
    //     const targetElement = document.getElementById(fragment);

    //     if (targetElement) {
    //       targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //     }
    //   }
    // });

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
  