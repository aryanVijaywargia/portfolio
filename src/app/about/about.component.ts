import { Component, ElementRef, ViewChild } from '@angular/core';
import { ABOUT } from './ABOUT';
import { HeroHeightService } from '../hero-height.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
})
export class AboutComponent {
  @ViewChild('buttonRef') buttonRef!: ElementRef<HTMLButtonElement>;
  focusImageIndex:number = 0;
  image:any= ABOUT.images[0]; 
  index:number = 0;
  rangeIndex:string="";
  ABOUT = ABOUT;

  trackRangeValue(newValue: string) {
    // this.items.push(newItem);
    this.rangeIndex = newValue;
  }


  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef;

  constructor(private heroHeightService: HeroHeightService) {}

  ngAfterViewInit() {
    const heroSectionHeight = this.heroSection.nativeElement.clientHeight;
    this.heroHeightService.setHeroHeight(heroSectionHeight);
  }


}
