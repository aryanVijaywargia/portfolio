// import {
//   faAward,
//   faBriefcase,
//   faCertificate,
//   faDownload,
//   faEnvelope,
//   faEye,
//   faGraduationCap,
//   faLightbulb,
//   faRocket,
//   faUser,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/angular-fontawesome";
// import { HamburgerSpin } from "hamburger-css";
// import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
// import { DarkModeSwitch } from "angular-toggle-dark-mode";
// import OptionButton from "./navbar/OptionButton";
// import { ElementRef, OnInit } from '@angular/core';

// @Component({
//   selector: "app-navbar",
//   templateUrl: "./navbar.component.html",
//   styleUrls: ["./navbar.component.scss"],
// })
// export class NavbarComponent implements OnInit, AfterViewInit {
//   @Input() opacity!: number;
//   @Input() heroRef!: ElementRef;
//   @Input() skillRef!: ElementRef;
//   @Input() workRef!: ElementRef;
//   @Input() experienceRef!: ElementRef;
//   @Input() awardRef!: ElementRef;
//   @Input() certificateRef!: ElementRef;
//   @Input() educationRef!: ElementRef;
//   @Input() contactRef!: ElementRef;
//   @Input() darkMode!: boolean;
//   @Input() audioRef!: ElementRef;
//   @Input() stat: any;

//   @ViewChild("menuRef") menuRef!: ElementRef;

//   isSkillsVisible!: boolean;
//   isWorkVisible!: boolean;
//   isExperienceVisible!: boolean;
//   isAwardVisible!: boolean;
//   isCertificateVisible!: boolean;
//   isEducationVisible!: boolean;
//   isContactVisible!: boolean;
//   isSkillHover!: boolean;
//   isWorkHover!: boolean;
//   isExperienceHover!: boolean;
//   isAwardHover!: boolean;
//   isCertificateHover!: boolean;
//   isEducationHover!: boolean;
//   isContactHover!: boolean;
//   isMenuToggle!: boolean;

//   constructor() {}

//   ngOnInit(): void {}

//   ngAfterViewInit(): void {
    
//     this.isSkillsVisible = this.useOnScreen(this.skillRef.nativeElement);
//     this.isWorkVisible = this.useOnScreen(this.workRef.nativeElement);
//     this.isExperienceVisible = this.useOnScreen(this.experienceRef.nativeElement);
//     this.isAwardVisible = this.useOnScreen(this.awardRef.nativeElement);
//     this.isCertificateVisible = this.useOnScreen(this.certificateRef.nativeElement);
//     this.isEducationVisible = this.useOnScreen(this.educationRef.nativeElement);
//     this.isContactVisible = this.useOnScreen(this.contactRef.nativeElement);
//   }

//   useOnScreen(ref: ElementRef, rootMargin = '0px'): boolean {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         this.isSkillsVisible = Math.ceil(entry.intersectionRatio - 0.085)> 0;
//       },
//       {
//         rootMargin
//       }
//     );

//     const currentElement = ref?.nativeElement;

//     if (currentElement) {
//       observer.observe(currentElement);
//     }

//     return this.isSkillsVisible;
//   }

//   executeScroll(ref: ElementRef): void {
//     const isMobile = document.documentElement.clientWidth < 480;
//     if (isMobile) {
//       ref.nativeElement.scrollIntoView({ behavior: "smooth" });
//     } else {
//       const yOffset = -45;
//       const y = ref.nativeElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
//       window.scrollTo({ top: y, behavior: "smooth" });
//     }
//   }

//   toggleDarkMode(): void {
//     this.darkMode = !this.darkMode;
//     this.audioRef.nativeElement.play();
//   }

//   formatter(number: number): string {
//     const formatter = new Intl.NumberFormat("en", { notation: "compact" });
//     return formatter.format(number);
//   }
// }






// import {
//   faAward,
//   faBriefcase,
//   faCertificate,
//   faDownload,
//   faEnvelope,
//   faEye,
//   faGraduationCap,
//   faLightbulb,
//   faRocket,
//   faUser,
// } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/angular-fontawesome";
// import { HamburgerSpin } from "ngx-hamburger-spin";
// import { ViewChild, ElementRef } from "@angular/core";
// import { DarkModeSwitch } from "ngx-dark-mode-switch";
// import OptionButton from "./navbar/OptionButton.component";

// export class NavbarComponent implements OnInit {
//   @ViewChild("menuRef") menuRef: ElementRef;

//   isSkillsVisible!: boolean;
//   isWorkVisible!: boolean;
//   isExperienceVisible!: boolean;
//   isAwardVisible!: boolean;
//   isCertificateVisible!: boolean;
//   isEducationVisible!: boolean;
//   isContactVisible!: boolean;
//   isSkillHover!: boolean;
//   isWorkHover!: boolean;
//   isExperienceHover!: boolean;
//   isAwardHover!: boolean;
//   isCertificateHover!: boolean;
//   isEducationHover!: boolean;
//   isContactHover!: boolean;
//   isMenuToggle!: boolean;

//   constructor(private audioRef: ElementRef) {}

//   ngOnInit() {}

//   executeScroll(ref: ElementRef) {
//     const isMobile = window.innerWidth < 480;
//     if (isMobile) {
//       ref.nativeElement.scrollIntoView({ behavior: "smooth" });
//     } else {
//       const yOffset = -45;
//       const y =
//         ref.nativeElement.getBoundingClientRect().top +
//         window.pageYOffset +
//         yOffset;
//       window.scrollTo({ top: y, behavior: "smooth" });
//     }
//   }

//   toggleDarkMode() {
//     this.darkMode = !this.darkMode;
//     this.audioRef.nativeElement.play();
//   }

//   formatter(number) {
//     const formatter = new Intl.NumberFormat("en", { notation: "compact" });
//     return formatter.format(number);
//   }

//   onClickOptionButton(ref: ElementRef) {
//     this.executeScroll(ref);
//     setTimeout(() => {
//       this.isMenuToggle = false;
//     }, 500);
//   }
// }


// import {
//   faAward,
//   faBriefcase,
//   faCertificate,
//   faDownload,
//   faEnvelope,
//   faEye,
//   faGraduationCap,
//   faLightbulb,
//   faRocket,
//   faUser,
//   faHome,
//   faBell
// } from "@fortawesome/free-solid-svg-icons";

// import { FontAwesomeIcon } from "@fortawesome/angular-fontawesome";
// import { HamburgerSpin } from "hamburger-css";
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from "@angular/core";
// import { DarkModeSwitch } from "angular-toggle-dark-mode";
// import OptionButton from "./navbar/OptionButton";
// import { ElementRef, OnInit } from '@angular/core';

@Component({
  selector: "app-navbar",
  templateUrl: "navbar.component.html",
  styleUrls: ["navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  // @Input() opacity!: number;
  // @Input() heroRef!: ElementRef;
  // @Input() skillRef!: ElementRef;
  // @Input() workRef!: ElementRef;
  // @Input() experienceRef!: ElementRef;
  // @Input() awardRef!: ElementRef;
  // @Input() certificateRef!: ElementRef;
  // @Input() educationRef!: ElementRef;
  // @Input() contactRef!: ElementRef;
  // @Input() darkMode!: boolean;
  // @Input() audioRef!: ElementRef;
  // @Input() stat: any;
  // @Input() icon!: string;
  // @ViewChild("menuRef") menuRef!: ElementRef;

  // isSkillsVisible = false;
  // isWorkVisible = false;
  // isExperienceVisible = false;
  // isAwardVisible = false;
  // isCertificateVisible = false;
  // isEducationVisible = false;
  // isContactVisible = false;
  // isSkillHover = false;
  // isWorkHover = false;
  // isExperienceHover = false;
  // isAwardHover = false;
  // isCertificateHover = false;
  // isEducationHover = false;
  // isContactHover = false;
  // // isMenuToggle = false;
  // isMenuToggle: boolean = false; // Define the isMenuToggle property with an initial value

  // // Define and implement the setIsMenuToggle method
  // faEnvelope = faEnvelope;
  // faRocket=faRocket;
  // faLightbulb=faLightbulb;
  // faBriefcase=faBriefcase;
  // faGraduationCap=faGraduationCap;
  // faAward=faAward;

  // constructor() {}

  ngOnInit(): void {}

  // ngAfterViewInit(): void {
  //   this.checkVisibility(this.skillRef, 'isSkillsVisible');
  //   this.checkVisibility(this.workRef, 'isWorkVisible');
  //   this.checkVisibility(this.experienceRef, 'isExperienceVisible');
  //   this.checkVisibility(this.awardRef, 'isAwardVisible');
  //   this.checkVisibility(this.certificateRef, 'isCertificateVisible');
  //   this.checkVisibility(this.educationRef, 'isEducationVisible');
  //   this.checkVisibility(this.contactRef, 'isContactVisible');
  // }

  // checkVisibility(ref: ElementRef, propName: keyof NavbarComponent, rootMargin = '0px'): void {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       const isVisible = Math.ceil(entry.intersectionRatio - 0.085) > 0;
  //       if (isVisible) {
  //         (this[propName as keyof NavbarComponent] as boolean) = true;
  //       }
  //     },
  //     {
  //       rootMargin
  //     }
  //   );
  
  //   const currentElement = ref?.nativeElement;
  
  //   if (currentElement) {
  //     observer.observe(currentElement);
  //   }
  // }

  // setIsMenuToggle(value: boolean): void {
  //   this.isMenuToggle = value;
  // }
  
  

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

  // toggleDarkMode(): void {
  //   this.darkMode = !this.darkMode;
  //   this.audioRef.nativeElement.play();
  // }

  // formatter(number: number): string {
  //   const formatter = new Intl.NumberFormat("en", { notation: "compact" });
  //   return formatter.format(number);
  // }


  isFixed = false; // Flag to determine if the headbar is fixed
  opacity = 0.5; // Opacity of the headbar
  homeIcon = 'home';
  notificationsIcon = 'notifications';
  profileIcon = 'person';
  @HostListener('window:scroll')
  onWindowScroll() {
    // Detect scroll position
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // Check if the headbar should be fixed
    this.isFixed = scrollPosition >= window.innerHeight;

    // Calculate opacity based on scroll position
    this.opacity = scrollPosition >= window.innerHeight ? 1 : (scrollPosition / window.innerHeight);
  }

  @Output() iconClick: EventEmitter<string> = new EventEmitter<string>();

  // homeIcon = faHome;
  // notificationsIcon = faBell;
  // profileIcon = faUser;

  onIconClick(icon: string) {
    this.iconClick.emit(icon);
  }

}

