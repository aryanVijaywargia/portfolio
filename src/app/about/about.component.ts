import { Component, ElementRef, ViewChild } from '@angular/core';
import { ABOUT } from './ABOUT';
import { HeroHeightService } from '../shared/services/hero-height.service';
import { TimelineComponent } from '../time-line/time-line.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
})
export class AboutComponent {
  @ViewChild('buttonRef') buttonRef!: ElementRef<HTMLButtonElement>;
  focusImageIndex: number = 0;
  image: any = ABOUT.images;
  tooltip: any = ABOUT.tooltip;
  index: number = 0;
  rangeIndex: string = "";
  ABOUT = ABOUT;

  private subscription!: Subscription;

  @ViewChild(TimelineComponent) timelineComponent!: TimelineComponent;

  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef;
  selectedBar: any;
  receivedSelectedBar!: any;

  constructor(private heroHeightService: HeroHeightService) {
  }

  ngOnInit() {
  }

  onSelectedValueChange(value: any) {
    this.rangeIndex = value;
    console.log("The vlaue of this.rangeIndex is ", this.rangeIndex)
  }



  ngAfterViewInit() {
    this.timelineComponent.startHighlightingSequence();
    const heroSectionHeight = this.heroSection.nativeElement.clientHeight;
    this.heroHeightService.setHeroHeight(heroSectionHeight);
    this.timelineComponent.lastBarHighlighted.subscribe(() => {
      setTimeout(() => {
        this.timelineComponent.startHighlightingSequence();;
      }, 2000);
    });
  }





}
