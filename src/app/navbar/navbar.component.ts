import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild, ViewChildren } from "@angular/core";
import { HeroHeightService } from "../hero-height.service";
// import { DarkModeSwitch } from "angular-toggle-dark-mode";
// import OptionButton from "./navbar/OptionButton";
// import { ElementRef, OnInit } from '@angular/core';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
import { Router } from "@angular/router";
import { ViewportScroller } from "@angular/common";
// import smoothscroll from 'smoothscroll-polyfill';
// import smoothscroll from 'smoothscroll-polyfill';
import * as smoothscroll from "smoothscroll-polyfill";
import { ThemeService } from "../theme.service";
import { Subscription } from 'rxjs';
import { ChatbotToggleService } from "../chatbot-toggle.service";

// kick off the polyfill!

// kick off the polyfill!

@Component({
  selector: "app-navbar",
  templateUrl: "navbar.component.html",
  styleUrls: ["navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  faGithub = faGithub;
  private subscription: Subscription
  receivedTheme!: boolean;
  chatToggle: boolean = false;
  // constructor() {}

  constructor(private chatbotToggleService: ChatbotToggleService, private themeService: ThemeService, private renderer: Renderer2, private header: ElementRef, private router: Router, private viewportScroller: ViewportScroller) {
    smoothscroll.polyfill();
    this.subscription = this.themeService.sharedData$.subscribe(data => {
      this.receivedTheme = data;
    });

    this.subscription = this.chatbotToggleService.command$.subscribe((command) => {
      this.chatToggle = command
    });

  }

  toggleChat() {
    this.chatToggle = !this.chatToggle;
    this.chatbotToggleService.sendCommand(this.chatToggle);
    console.log(this.chatToggle)
  }


  
  @ViewChildren('buttonView', { read: ElementRef }) buttonView!: ElementRef[];

  // constructor() {}

  // @HostListener('window:load', ['$event'])
  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event): void {
  //   this.updateActiveIcons();
  // }

  ngAfterViewInit(): void {
    this.updateActiveIcons(); // Call initially after view initialization
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    this.updateActiveIcons();
  }


  private updateActiveIcons(): void {
    const iconElements = document.querySelectorAll('.button1');

    // const scrollPosition = window.scrollY + window.innerHeight / 2;

    // this.buttonView.forEach((buttonView: ElementRef) => {
    //   const iconTop = buttonView.nativeElement.getBoundingClientRect().top + window.scrollY;

    //   if (scrollPosition >= iconTop) {
    //     this.renderer.addClass(buttonView.nativeElement, 'button1:hover');
    //   } else {
    //     this.renderer.removeClass(buttonView.nativeElement, 'button1:hover');
    //   }
    // });
    const scrollPosition = window.scrollY + window.innerHeight / 2; // Midpoint of visible area

  iconElements.forEach((icon) => {
    const iconTop = icon.getBoundingClientRect().top + window.scrollY;

    if (scrollPosition >= iconTop) {
      icon.classList.add('button1:hover');
    } else {
      icon.classList.remove('button1:hover');
    }
  });
  }


// Function to add or remove the 'active' class based on scroll position
// function updateActiveIcons() {
  
// }

// Update active icons on page load and scroll
// window.addEventListener('load', updateActiveIcons);
// window.addEventListener('scroll', updateActiveIcons);



  scrollToElement() {
    const element = document.getElementById('targetElement');
    if (element) {
      this.viewportScroller.scrollToAnchor('targetElement');
    }

  }

  // responsiveMenuVisible!: boolean;
  // smoothscroll.polyfill();
  // smoothscroll.polyfill();

  // @ViewChild('targetElement') targetElement!: ElementRef;

  // scrollToElement() {
  //   const element = this.targetElement.nativeElement;
  //   console.log("THis is the stuff ", element);
  //   element.scrollIntoView({ behavior: 'smooth' });
  // }


  scroll(el: any) {
    
    if(document.querySelector(el)) {
      console.log("THIS iS THE VALUE 1 " + el);
      // setTimeout(() => {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });

      document.querySelector(el).scrollIntoView({behavior: 'smooth'});
      console.log("THIS iS THE VALUE 2 " + el);
      // }, 100)
    } else{
      this.router.navigate(['/home']).then(()=> document!.getElementById(el)!.scrollIntoView({behavior: 'smooth'}) );
    }
    // this.responsiveMenuVisible=false;
  }
  
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

