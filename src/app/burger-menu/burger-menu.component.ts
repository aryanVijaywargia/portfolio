import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss']
})
export class BurgerMenuComponent {

   HEADER = {
    nav: [
      {
        title: "Home",
        alt: "Country Road.....",
        href:"#/"
      },
      {
        title: "About Me",
        alt: "Know More",
        href:"#/about"
      },
      {
        title: "Experience",
        alt: "Where I have worked",
        href:"#/experience"
      },
      {
        title: "Projects",
        alt: "Some things I have built",
        href:"#/projects"
      },
      {
        title: "Contact me",
        alt: "Get in touch",
        href:"#/contact"
      },
    ],
  };

  // @Input() showNav!: boolean;
  @Input() showNav: boolean = true;
  @Output() setShowNav = new EventEmitter<boolean>();

  toggleNav() {
    this.setShowNav.emit(!this.showNav);
  }

  @Output() childRendered: EventEmitter<void> = new EventEmitter<void>();

  ngAfterViewInit() {
    // Notify the parent component that the child is completely rendered
    this.childRendered.emit();
  }


  constructor() {}

  trackByIndex(index: number, item: any): number {
    return index;
  }
  


}
