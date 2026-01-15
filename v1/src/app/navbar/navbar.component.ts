import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild, ViewChildren } from "@angular/core";
import { HeroHeightService } from "../shared/services/hero-height.service";
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
import { Router } from "@angular/router";
import { ViewportScroller } from "@angular/common";
import * as smoothscroll from "smoothscroll-polyfill";
import { ThemeService } from "../shared/services/theme.service";
import { Subscription } from 'rxjs';
import { ChatbotToggleService } from "../shared/services/chatbot-toggle.service";
import { ScrollSpyService } from "../shared/services/scroll-spy.service";
import { style } from '@angular/animations';



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
  navFlag: boolean = false;

  constructor(private scrollPositionService: ScrollSpyService, private chatbotToggleService: ChatbotToggleService, private themeService: ThemeService, private renderer: Renderer2, private header: ElementRef, private router: Router, private viewportScroller: ViewportScroller) {
    smoothscroll.polyfill();
    this.subscription = this.themeService.sharedData$.subscribe(data => {
      this.receivedTheme = data;
    });

    this.subscription = this.chatbotToggleService.command$.subscribe((command) => {
      this.chatToggle = command
    });

  }

  private scrollSubscription!: Subscription;

  @ViewChild('parentDiv') parentDiv!: ElementRef;

  onZIndexRendered() {
    const children = this.parentDiv.nativeElement.children;
    children[0].firstChild.style.zIndex = '5'
    children[1].style.zIndex = '5'
    children[2].style.zIndex = '5'
    children[4].children[0].firstChild.style.zIndex = '5'
  }

  toggleChat() {
    this.chatToggle = !this.chatToggle;
    this.chatbotToggleService.sendCommand(this.chatToggle);
  }
  private isScrolling: boolean = false;

  toggleNav() {
    this.navFlag = !this.navFlag;
  }

  onClickScroll(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }



  @ViewChildren('buttonView', { read: ElementRef }) buttonView!: ElementRef[];


  ngAfterViewInit(): void {
    this.updateActiveIcons(); // Call initially after view initialization
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    this.updateActiveIcons();
  }


  private updateActiveIcons(): void {
    const iconElements = document.querySelectorAll('.button1');


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











  scrollThreshold!: number;
  isFixed: boolean = false;
  opacity: number = 0;

  activeSection: string = '';
  sectionPositions: Map<string, number> = new Map<string, number>();

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

