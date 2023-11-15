import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {  NbSidebarState, NbThemeService } from '@nebular/theme';
import { NbSidebarService } from '@nebular/theme';
import { ThemeService } from '../theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot-sidenav',
  templateUrl: './chatbot-sidenav.component.html',
  styleUrls: ['./chatbot-sidenav.component.scss']
})
export class ChatbotSidenavComponent {

  @ViewChild('sidenav', { static: true }) sidenav!: ElementRef;
  projTheme: any;
  private sidebarStateSubscription!: Subscription;


  chatToggle:boolean = false;
  constructor(private sidebarService: NbSidebarService, private themeService: NbThemeService, private renderer: Renderer2, private projThemeService: ThemeService, ) {
    this.themeService.changeTheme('dark');


  }

  ngOnInit(){
    this.projThemeService.sharedData$.subscribe(data => {
      this.projTheme = data;
      if(this.projTheme){
        this.themeService.changeTheme('default');
      }
      else{
        this.themeService.changeTheme('dark');
        // this.addThemeClass();
        
      }
      
    });
  }
  


  // private addThemeClass() {
  //   // Check if the sidenav ViewChild is available
  //   if (!this.projTheme && this.sidenav && this.sidenav.nativeElement) {
  //     const isLightTheme = this.sidenav.nativeElement.classList.contains('nb-theme-default');
  //     if (isLightTheme) {
  //       this.renderer.removeClass(this.sidenav.nativeElement, 'nb-theme-default');
  //     }
  //     this.renderer.addClass(this.sidenav.nativeElement, 'nb-theme-dark');
  //   }
  //   else if(this.projTheme && this.sidenav && this.sidenav.nativeElement){
  //     const isDarkTheme = this.sidenav.nativeElement.classList.contains('nb-theme-dark');
  //     if (isDarkTheme) {
  //       this.renderer.removeClass(this.sidenav.nativeElement, 'nb-theme-dark');
  //     }
  //     this.renderer.addClass(this.sidenav.nativeElement, 'nb-theme-default')
  //   }
  // }



  // constructor(private sidebarService: NbSidebarService) {}

  
  private toggleThemeClass(flag:boolean) {
    // Check if the sidenav ViewChild is available
    // if (this.sidenav && this.sidenav.element.nativeElement) {
      // this.renderer.addClass(this.sidenav.element.nativeElement, 'nb-theme-dark');
      const element = document.querySelector('.chat-sidenav');
      // console.log(element);
      if (element && flag && !this.projTheme) {
        element.classList.add('nb-theme-dark');
      }
       if (element && !flag && !this.projTheme){
        element.classList.remove('nb-theme-dark');
      }

      if (element && flag && this.projTheme) {
        element.classList.add('nb-theme-default');
      }
       if (element && !flag && this.projTheme){
        element.classList.remove('nb-theme-default');
      }
    // }
  }


  



  toggleChat() {
    this.chatToggle = !this.chatToggle;
    // if(this.chatToggle){
      // this.toggleDarkThemeClass(true);
    // }
    // else{
      this.toggleThemeClass(this.chatToggle);
    // }
    this.sidebarService.toggle(this.chatToggle, 'chat-sidebar');

    // this.sidebarStateSubscription = this.sidebarService.onToggle()
    //   .subscribe(({ compact, tag }) => {
    //     const sidebarElement = document.querySelector('.chat-sidenav');

    //     // Check the compact property or any other relevant property for your condition
    //     if (compact) {
    //       sidebarElement!.classList.add('start-closing');
    //       sidebarElement!.classList.remove('start-opening');
    //     } else {
    //       sidebarElement!.classList.remove('start-closing');
    //       sidebarElement!.classList.add('start-opening');
    //     }
    //   });


  }

}
