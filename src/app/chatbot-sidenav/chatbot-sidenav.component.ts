import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {  NbSidebarState, NbThemeService } from '@nebular/theme';
import { NbSidebarService } from '@nebular/theme';
import { ThemeService } from '../theme.service';
import { Subscription } from 'rxjs';
import { ChatbotToggleService } from '../chatbot-toggle.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-chatbot-sidenav',
  templateUrl: './chatbot-sidenav.component.html',
  styleUrls: ['./chatbot-sidenav.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({ transform: 'none' })),
      state('false', style({ transform: 'translateX(100%)' })),
      transition('true => false', animate('300ms ease-in-out')),
      transition('false => true', animate('300ms ease-in-out')),
    ]),
  ],


})
export class ChatbotSidenavComponent {

  // @ViewChild('sidenav', { static: true }) sidenav!: ElementRef;
  // projTheme: any;
  // private sidebarStateSubscription!: Subscription;
  // chatToggle:boolean = false;
  // subscription: Subscription;
  // sidebarOpened: boolean=false;

  // onSlideAnimationStart() {
  //   console.log('Slide animation has started');
  // }
  
  // onSlideAnimationDone() {
  //   console.log('Slide animation has ended');
  // }
  

  // constructor(private chatbotToggleService: ChatbotToggleService, private sidebarService: NbSidebarService, private themeService: NbThemeService, private renderer: Renderer2, private projThemeService: ThemeService) {
  //   this.themeService.changeTheme('dark');
  //   this.subscription = this.chatbotToggleService.command$.subscribe((command) => {
  //     // Handle the command received from Component A
  //     this.chatToggle = command
  //     this.toggleThemeClass(command);
  //     // }
  //     this.sidebarService.toggle(command, 'chat-sidebar');
  
  //   });

  // }

  // ngOnInit(){
  //   this.projThemeService.sharedData$.subscribe(data => {
  //     this.projTheme = data;
  //     if(this.projTheme){
  //       this.themeService.changeTheme('default');
  //     }
  //     else{
  //       this.themeService.changeTheme('dark');
        
  //     }
      
  //   });
  // }
  

  
  // private toggleThemeClass(flag:boolean) {
  //   // Check if the sidenav ViewChild is available
  //   // if (this.sidenav && this.sidenav.element.nativeElement) {
  //     // this.renderer.addClass(this.sidenav.element.nativeElement, 'nb-theme-dark');
  //     const element = document.querySelector('.chat-sidenav');
  //     // console.log(element);
  //     if (element && flag && !this.projTheme) {
  //       element.classList.add('nb-theme-dark');
  //     }
  //     //  if (element && !flag && !this.projTheme){
  //     //   element.classList.remove('nb-theme-dark');
  //     // }

  //     if (element && flag && this.projTheme) {
  //       element.classList.add('nb-theme-default');
  //     }
  //     //  if (element && !flag && this.projTheme){
  //     //   element.classList.remove('nb-theme-default');
  //     // }
  //   // }
  // }


  



  // toggleChat() {
  
  //   this.chatbotToggleService.sendCommand(false);



  // }

}
