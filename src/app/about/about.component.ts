import { Component, ElementRef, ViewChild } from '@angular/core';
import { ABOUT } from './ABOUT';
import { HeroHeightService } from '../hero-height.service';
import { TimelineComponent } from '../time-line/time-line.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
})
export class AboutComponent {
  @ViewChild('buttonRef') buttonRef!: ElementRef<HTMLButtonElement>;
  focusImageIndex:number = 0;
  image:any= ABOUT.images; 
  tooltip:any = ABOUT.tooltip;
  index:number = 0;
  rangeIndex:string="";
  ABOUT = ABOUT;

  // trackRangeValue(newValue: string) {
  //   this.rangeIndex = newValue;
  // }

  @ViewChild(TimelineComponent) timelineComponent!: TimelineComponent;

  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef;

  constructor(private heroHeightService: HeroHeightService) {}

  ngOnInit(){
    this.startHighlightingSequence();
  }

  // rangeIndex!: number;

  onSelectedValueChange(value: any) {
    this.rangeIndex = value;
    console.log("The vlaue of this.rangeIndex is ", this.rangeIndex)
    // Do something with the selected value in the parent component
  }



  ngAfterViewInit() {
    this.startHighlightingSequence();
    const heroSectionHeight = this.heroSection.nativeElement.clientHeight;
    this.heroHeightService.setHeroHeight(heroSectionHeight);
    this.timelineComponent.lastBarHighlighted.subscribe(() => {
      setTimeout(() => {
        this.startHighlightingSequence();
      }, 2000); // Add a delay before restarting the sequence
    });
  }

  async startHighlightingSequence() {
    if(this.timelineComponent && this.timelineComponent.timelineEntries){
      for (const entry of this.timelineComponent.timelineEntries) {
        for (let i = 0; i < entry.events.length; i++) {
          await this.delay(4000); // Adjust the delay duration as needed
          this.timelineComponent.highlightVerticalBar(entry.year, i);
        }
      }
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}
