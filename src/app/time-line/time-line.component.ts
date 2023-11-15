import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TIMELINEOBJECT, TimelineEvent } from './time-line';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})

export class TimelineComponent implements OnInit {
  @ViewChild('scrollContainerRef', { static: true }) scrollContainerRef!: ElementRef<HTMLDivElement>;
  @Output() lastBarHighlighted = new EventEmitter<void>();
  public selected: string = ''; 
  initiated = false;
  autoAnimate = true;
  autoScroll = true;
  inView = false;

  TIMELINEOBJECT = TIMELINEOBJECT;
  faCoffee = faCoffee;
  selectedIconIndex: number | null = null;

  // setSelected(index: number) {
  //   this.selectedIconIndex = index;
  // }
  
  
  // timelineEntries: [string, TimelineEvent[]][] = Object.entries(this.TIMELINEOBJECT);

  // events!:[];
  // extractYearAndEvents(entry: [string, TimelineEvent[]]): { year: string; events: TimelineEvent[] } {
  //   return { year: entry[0], events: entry[1] };
  // }

  timelineEntries: any[] = Object.entries(this.TIMELINEOBJECT).map(
    ([year, events]) => ({
      year,
      events,
      descriptions: events.map(event => event.description),
      headings: events.map(event => event.heading),
      icons: events.map(event => event.Icon),
    })
  );

  ngAfterViewInit(){
    this.scrollToSection();
  }

  // public getCombinedValue(entry:any, index: number): string {
  //   console.log( `${entry.year}-${index}`);
  //   return `${entry.year}-${index}`;
  // }

  public getCombinedValue(year: string, index: number): string {
    return `${year}-${index}`;
  }


  highlightVerticalBar(year: string, index: number) {
    const container = this.scrollContainerRef.nativeElement;
    const targetPosition = container.scrollLeft + container.clientWidth / 2 - 60; // Adjust the offset as needed
    const barElement = container.querySelector(`[data-bar="${year}-${index}"]`);
  
    if (barElement) {
      const barPosition = barElement.getBoundingClientRect().left + container.scrollLeft;
      const duration = 1000; // Duration of the scrolling animation in milliseconds
  
      this.scrollToX(duration, barPosition - targetPosition, container, () => {
        // Highlight the bar
        this.setSelected(`${year}-${index}`);
        if (this.isLastBar(year, index)) {
          // setTimeout(() => {
            this.lastBarHighlighted.emit();
          // }, 2000); // Add a delay before restarting the sequence
        }
  
      });
    }
  }

  isLastBar(year: string, index: number): boolean {
    const lastEntry = this.timelineEntries[this.timelineEntries.length - 1];
    return year === lastEntry.year && index === lastEntry.events.length - 1;
  }
  
  



  ngOnInit() {
    setTimeout(() => {
      const year = Object.keys(this.TIMELINEOBJECT)[0];
      this.initiated = true;
      this.setSelected(`${year}-${0}`);
    }, 50);
  }

  onInViewChanged(inView: any) {
    if (!this.initiated && inView) {
      const container = this.scrollContainerRef.nativeElement;
      setTimeout(() => {
        const year = Object.keys(this.TIMELINEOBJECT)[0];
        this.initiated = true;
        this.setSelected(`${year}-${0}`);
      }, 50);
    }
  }

  setSelected(selected: string) {
    // this.autoScroll = false;
    this.selected = selected;
    // const [year, index] = selected.split("-");
    // this.selectedIconIndex = parseInt(index, 10);
    // this.scrollToSection();
  }

  scrollToSection() {
    const container = this.scrollContainerRef.nativeElement;
    const targetPosition = 500; // Replace 500 with the target scroll position you want to reach
    const duration = 1000; // Duration of the scrolling animation in milliseconds
  
    this.scrollToX(duration, targetPosition, container);
  }
  

  onTimelineItemPointerOver(selected: string) {
    // this.autoScroll = false;
    this.setSelected(selected);
  }

  onTimelineItemFocused(selected: string) {
    // this.autoScroll = false;
    this.setSelected(selected);
  }

  onAutoScrollDebounced() {
    this.autoScroll = true;
  }

  onAutoScrollTimeoutDebounced() {
    this.autoScroll = true;
  }

  scrollToX(duration: number, to: number, container: HTMLElement | Window = window, callback: () => void = () => {}) {
    const start = container instanceof HTMLElement ? container.scrollLeft : container.scrollX;

    const change = to - start;
    const startDate = new Date().getTime();

    const animateScroll = () => {
      const currentDate = new Date().getTime();
      const currentTime = currentDate - startDate;

      container.scrollTo(this.easeInOutQuad({ currentTime, start, change, duration }), 0);

      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        container.scrollTo(to, 0);
        callback();
      }
    };
    animateScroll();
  }

  private easeInOutQuad({ currentTime, start, change, duration }: any): number {
    currentTime /= duration / 2;
    if (currentTime < 1) {
      return (change / 2) * currentTime * currentTime + start;
    }
    currentTime--;
    return (-change / 2) * (currentTime * (currentTime - 2) - 1) + start;
  }
}
