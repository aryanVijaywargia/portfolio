import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTransition]'
})
export class TransitionDirective {

  constructor(private renderer: Renderer2, private element: ElementRef) { }
  
  
  
  
  @HostListener('mouseenter')
  onIconMouseEnter() {
    

    // Apply CSS styles and transitions for icon slide effect
    this.renderer.setStyle(this.element.nativeElement, 'transform', 'translateX(-10px)');
    this.renderer.setStyle(this.element.nativeElement, 'transition', 'transform 0.3s ease-in-out');

    // Show the text with fade-in effect
    this.renderer.setStyle(this.element.nativeElement.children[1], 'opacity', '1');
    this.renderer.setStyle(this.element.nativeElement.children[1], 'transition', 'opacity 0.3s ease-in-out');
    this.renderer.setStyle(this.element.nativeElement.children[1], 'position', 'absolute');
this.renderer.setStyle(this.element.nativeElement.children[1], 'top', '0');
this.renderer.setStyle(this.element.nativeElement.children[1], 'left', '-10px');

    // this.renderer.setStyle(this.iconText2.nativeElement, 'opacity', '1');
    // this.renderer.setStyle(this.iconText2.nativeElement, 'transition', 'opacity 0.3s ease-in-out');
  }

  @HostListener('mouseleave')
  onIconMouseLeave() {
    // const icon = event.target as HTMLElement;

    // Reset CSS styles and transitions for icon slide effect
    this.renderer.removeStyle(this.element.nativeElement, 'transform');
    this.renderer.removeStyle(this.element.nativeElement, 'transition');

    // Hide the text with fade-out effect
    this.renderer.setStyle(this.element.nativeElement.children[1], 'opacity', '0');
    // this.renderer.setStyle(this.element.nativeElement.children[1], 'display', 'none');
    this.renderer.setStyle(this.element.nativeElement.children[1], 'transition', 'opacity 0.3s ease-in-out');
    // this.renderer.setStyle(this.iconText2.nativeElement, 'opacity', '0');
    // this.renderer.setStyle(this.iconText2.nativeElement, 'transition', 'opacity 0.3s ease-in-out');
  }

}
