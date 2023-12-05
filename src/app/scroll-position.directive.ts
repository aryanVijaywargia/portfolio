import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ScrollSpyService } from './scroll-spy.service';

@Directive({
  selector: '[appScrollPosition]'
})
export class ScrollPositionDirective {

  @Input() componentName!: string;

  constructor(
    private el: ElementRef,
    private scrollPositionService: ScrollSpyService
  ) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    const scrollPosition = (event.target as Element).scrollTop;
    this.scrollPositionService.setScrollPosition(
      this.componentName,
      scrollPosition
    );
  }

}
