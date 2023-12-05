import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

interface ScrollNavigation {
  prev: boolean;
  next: boolean;
}
interface EaseInOutQuadOptions {
  change: number;
  currentTime: number;
  duration: number;
  start: number;
}

const easeInOutQuad = ({ currentTime, start, change, duration }: EaseInOutQuadOptions): number => {
  let newCurrentTime = currentTime;
  newCurrentTime /= duration / 2;

  if (newCurrentTime < 1) {
    return (change / 2) * newCurrentTime * newCurrentTime + start;
  }

  newCurrentTime -= 1;
  return (-change / 2) * (newCurrentTime * (newCurrentTime - 2) - 1) + start;
}

const scrollToX = (
  duration: number,
  to: number,
  container: HTMLElement | Window = window,
  callback: () => void = () => {}
): void => {
  const start = container instanceof HTMLElement ? container.scrollLeft : container.scrollX;

  const change = to - start;
  const startDate = new Date().getTime();

  const animateScroll = () => {
    const currentDate = new Date().getTime();
    const currentTime = currentDate - startDate;

    container.scrollTo(
      easeInOutQuad({
        currentTime,
        start,
        change,
        duration,
      }),
      0
    );

    if (currentTime < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      container.scrollTo(to, 0);
      callback();
    }
  };
  animateScroll();
};

@Component({
  selector: 'app-scroll-gallery',
  templateUrl: './scroll-gallery.component.html',
  styleUrls: ['./scroll-gallery.component.scss']
})
export class ScrollGalleryComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef;

  scrollNavigation: ScrollNavigation = { prev: false, next: true };
  isScrolling = false;

  @Input() itemWidth!:number;
  // itemWidth = 0;
  @Input() gapWidth!:number;
  filter = 'All Projects'; // Set the initial filter value

  constructor() { }

  ngOnInit(): void {
    this.updateScrollNavigation();
    this.scrollToBeginning();
  }

  private getScrollDirection(scrollContainer: HTMLElement): 'left' | 'right' {
    const previousScroll = Number(scrollContainer.dataset['previousScroll']) || 0;
    if (scrollContainer.scrollLeft < previousScroll) {
      // Scrolling to the left
      scrollContainer.dataset['previousScroll'] = scrollContainer.scrollLeft.toString();
      return 'left';
    } else {
      // Scrolling to the right or no horizontal scroll change
      scrollContainer.dataset['previousScroll'] = scrollContainer.scrollLeft.toString();
      return 'right';
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event:Event): void {
    const scrollContainer = this.scrollContainerRef.nativeElement as HTMLElement;
   
      this.updateScrollNavigation();
   
  }
  handleClickPrevious(): void {
    // if (this.isScrolling) return;
    const scrollContainer = this.scrollContainerRef.nativeElement as HTMLDivElement;
    scrollContainer.classList.remove('snap-x');
    // this.isScrolling = true;

    scrollToX(
      200,
      Math.max(scrollContainer.scrollLeft - this.itemWidth - this.gapWidth, 0),
      scrollContainer,
      () => {
        scrollContainer.classList.add('snap-x');
        this.updateScrollNavigation();
      }
    );
  }

  handleClickNext(): void {

    const scrollContainer = this.scrollContainerRef.nativeElement as HTMLDivElement;
    scrollContainer.classList.remove('snap-x');

    scrollToX(200, scrollContainer.scrollLeft + this.itemWidth + this.gapWidth, scrollContainer, () => {
      scrollContainer.classList.add('snap-x');
      this.updateScrollNavigation();
    });
  }

  updateScrollNavigation(): void {
    if(this.scrollContainerRef!= null){
      const scrollContainer = this.scrollContainerRef.nativeElement as HTMLDivElement;
    this.scrollNavigation = {
      prev: scrollContainer.scrollLeft > 0,
      next: scrollContainer.children[scrollContainer.children.length - 1]?.getBoundingClientRect().right > window.innerWidth
    };
    }
    
  }

  scrollToBeginning(): void {
    if(this.scrollContainerRef!= null){
      const scrollContainer = this.scrollContainerRef.nativeElement as HTMLDivElement;
      scrollContainer.classList.remove('snap-x');
      
  
      scrollToX(200, 0, scrollContainer, () => {
        scrollContainer.classList.add('snap-x');
      });
    }
    }
}
