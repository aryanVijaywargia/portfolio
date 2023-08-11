import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { HeroHeightService } from "../hero-height.service";
// import { DarkModeSwitch } from "angular-toggle-dark-mode";
// import OptionButton from "./navbar/OptionButton";
// import { ElementRef, OnInit } from '@angular/core';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: "app-navbar",
  templateUrl: "navbar.component.html",
  styleUrls: ["navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  faGithub = faGithub;
  
  // executeScroll(ref: ElementRef): void {
  //   const isMobile = document.documentElement.clientWidth < 480;
  //   if (isMobile) {
  //     ref.nativeElement.scrollIntoView({ behavior: "smooth" });
  //   } else {
  //     const yOffset = -45;
  //     const y = ref.nativeElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
  //     window.scrollTo({ top: y, behavior: "smooth" });
  //   }
  // }

  // constructor() { }

  

  

  // isFixed = false; // Flag to determine if the headbar is fixed
  // opacity = 0.0; // Opacity of the headbar
  homeIcon = 'home';
  notificationsIcon = 'notifications';
  profileIcon = 'person';
  // @ViewChild('header', { static: true }) header!: ElementRef;
  // @HostListener('window:scroll')
  // onWindowScroll() {
  //   // Detect scroll position
  //   const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

  //   const yOffset = 0;
  //   // Check if the headbar should be fixed
  //   this.isFixed = scrollPosition + yOffset  >= window.innerHeight;
  //   if(this.isFixed){
  //     console.log(scrollPosition);
  //     console.log(yOffset);
  //     console.log(window.innerHeight)
  //   }

  //   // Calculate opacity based on scroll position
  //   this.opacity = scrollPosition >= window.innerHeight ? 1 : (scrollPosition / window.innerHeight);
  // }
  // ngOnInit() {
  //   this.heroHeightService.heroHeight$.subscribe((heroHeight) => {
  //     // Calculate the scroll position at which the header should be fixed (bottom of the hero section)
  //     // this.scrollThreshold = heroHeight;
  //     // Rest of your initialization code...
  //     // const headerTop = /
  //     this.scrollThreshold = this.header.nativeElement.offsetTop;;

  //   });
  // }
  // scrollThreshold:any;

  // ngOnInit() {
  //   // this.updateScrollThreshold();
  
  //   // const resizeObserver = new ResizeObserver(() => {
  //   //   this.updateScrollThreshold();
  //   // });
  
  //   // resizeObserver.observe(this.header.nativeElement);

  //   const headerInitPromise = new Promise<void>((resolve) => {
  //     if (this.header.nativeElement.offsetHeight > 0) {
  //       // Header element is already fully initialized
  //       resolve();
  //     } else {
  //       // Header element is not fully initialized, wait for it to be rendered
  //       const observer = new MutationObserver(() => {
  //         if (this.header.nativeElement.offsetHeight > 0) {
  //           observer.disconnect();
  //           resolve();
  //         }
  //       });
  //       observer.observe(this.header.nativeElement, { attributes: true });
  //     }
  //   });
  
  //   // Wait for the header element to be fully initialized before setting up the ResizeObserver
  //   headerInitPromise.then(() => {
  //     this.updateScrollThreshold();
  
  //     // Use ResizeObserver to dynamically update scrollThreshold
  //     const resizeObserver = new ResizeObserver(() => {
  //       this.updateScrollThreshold();
  //     });
  
  //     resizeObserver.observe(this.header.nativeElement);
  //   });
  // }

  // private updateScrollThreshold() {
  //   this.scrollThreshold = this.header.nativeElement.offsetTop;
  // }
  
  
  // private updateScrollThreshold() {
  //   this.scrollThreshold = this.header.nativeElement.offsetTop;
  //   console.log("THe vlaue of this.sT " +  this.scrollThreshold);
  // }
  

//   @HostListener('window:scroll')
// onWindowScroll() {
//   // Detect scroll position
//   const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

 
//   this.isFixed = scrollPosition >= this.scrollThreshold;

//   this.opacity = Math.min(1, scrollPosition / this.scrollThreshold);
// }


  
  // @Output() iconClick: EventEmitter<string> = new EventEmitter<string>();

  
  // onIconClick(icon: string) {
  //   this.iconClick.emit(icon);
  // }


  scrollThreshold!: number;
  isFixed: boolean = false;
  opacity: number = 0;

  constructor(private header: ElementRef) {}

  ngOnInit() {
    this.initializeHeader();
    this.setupResizeObserver();
  }

  private initializeHeader() {
    const headerInitPromise = new Promise<void>((resolve) => {
      if (this.header.nativeElement.offsetHeight > 0) {
        resolve();
      } else {
        const observer = new MutationObserver(() => {
          if (this.header.nativeElement.offsetHeight > 0) {
            observer.disconnect();
            resolve();
          }
        });
        observer.observe(this.header.nativeElement, { attributes: true });
      }
    });

    headerInitPromise.then(() => {
      this.updateScrollThreshold();
      this.updateNavbarBehavior();
    });
  }

  private setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.updateScrollThreshold();
      this.updateNavbarBehavior();
    });

    resizeObserver.observe(this.header.nativeElement);
  }

  private updateScrollThreshold() {
    this.scrollThreshold = this.header.nativeElement.offsetTop;
  }

  private updateNavbarBehavior() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    this.isFixed = scrollPosition >= this.scrollThreshold;
    this.opacity = Math.min(1, scrollPosition / this.scrollThreshold);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.updateNavbarBehavior();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.initializeHeader();
    this.updateNavbarBehavior();
  }

}

