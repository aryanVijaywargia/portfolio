import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbThemeModule, NbThemeService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { ThemeService } from '../theme.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChatbotToggleService } from '../chatbot-toggle.service';

@Component({
  selector: 'app-chatbot-ui',
  templateUrl: './chatbot-ui.component.html',
  styleUrls: ['./chatbot-ui.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({ transform: 'none' })),
      state('false', style({ transform: 'translateX(100%)' })),
      transition('true => false', [
        style({ transform: 'none' }), // Start from the current position
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)' })), // Move to the right
      ]),
      transition('false => true', animate('300ms ease-in-out')),
    ]),
  ]

  // encapsulation: ViewEncapsulation. Emulated
})
export class ChatbotUiComponent implements AfterViewInit{

  @ViewChild('nbChat', { static: true }) nbChat!: ElementRef;
  projTheme: any;
  private subscription: Subscription
  chatToggle: boolean=false;
  receivedTheme!: any;

  // @Input() receivedValue!: boolean ; 
  
  constructor(private el: ElementRef,private chatbotToggleService: ChatbotToggleService, private themeService: NbThemeService, private renderer: Renderer2, private projThemeService: ThemeService) {

    this.subscription = this.chatbotToggleService.command$.subscribe((command) => {
      this.chatToggle = command
      // this.toggleThemeClass(command);
      // }
      // this.sidebarService.toggle(command, 'chat-sidebar');
  
    });

    this.subscription = this.projThemeService.sharedData$.subscribe((data:any) => {
      this.receivedTheme = data;
    });

    
  }

  toggleChat() {
    this.chatbotToggleService.sendCommand(false);
  }
  
  ngOnInit(){
    this.projThemeService.sharedData$.subscribe(data => {
      this.projTheme = data;
      if(this.projTheme){
        this.themeService.changeTheme('default');
      }
      else{
        this.themeService.changeTheme('dark');
      }
      this.addThemeClass();
    });
  }
  

  

  // constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Accessing the nb-chat element
    
    const nbChatElement = this.el.nativeElement.querySelector('nb-chat');

    // if(this.projTheme){
    //   this.renderer.setStyle(nbChatElement, 'background-color', 'white')
    // }

    this.projThemeService.sharedData$.subscribe(data => {
      if(data){
        this.renderer.setStyle(nbChatElement, 'background-color', 'white')
      }
      else{
        this.renderer.setStyle(nbChatElement, 'background-color', 'rgba(15, 23, 42, 1)')
      }
    })
    // this.renderer.addClass(nbChatElement, 'd');

    // Accessing the child div with class 'header'
    const headerElement = nbChatElement.querySelector('.header');

    // Adding or modifying a class
    this.renderer.setStyle(headerElement, 'background-image', 'linear-gradient(to right,#0657d4, #0e5be9 var(--tw-gradient-via-position), #3b65f6 )');
    // this.renderer.setStyle(headerElement, '--tw-gradient-from', '#06b6d4 var(--tw-gradient-from-position)');
    // this.renderer.setStyle(headerElement, '--tw-gradient-stops', '#06b6d4, #0ea5e9 var(--tw-gradient-via-position), #3b82f6 ');
    // this.renderer.setStyle(headerElement, '--tw-gradient-to', '#3b82f6 var(--tw-gradient-to-position)');
  }

  closeSidebar() {
    // this.sidebarService.collapse('sidenav'); // Replace 'your-sidebar-name' with your sidebar's name
  }

  private addThemeClass() {
    // Check if the nbChat ViewChild is available
    if (!this.projTheme && this.nbChat && this.nbChat.nativeElement) {
      const isLightTheme = this.nbChat.nativeElement.classList.contains('nb-theme-default');
      if (isLightTheme) {
        this.renderer.removeClass(this.nbChat.nativeElement, 'nb-theme-default');
      }
      this.renderer.addClass(this.nbChat.nativeElement, 'nb-theme-dark');
    }
    else if(this.projTheme && this.nbChat && this.nbChat.nativeElement){
      const isDarkTheme = this.nbChat.nativeElement.classList.contains('nb-theme-dark');
      if (isDarkTheme) {
        this.renderer.removeClass(this.nbChat.nativeElement, 'nb-theme-dark');
      }
      this.renderer.addClass(this.nbChat.nativeElement, 'nb-theme-default')
    }
  }


  chats: any[] = [

    {
      status: 'primary',
      title: 'Chat with Olly',
      messages: [
        {
          text: 'Primary!',
          date: new Date(),
          reply: false,
          user: {
            name: 'Olly',
            avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png',
          },
        },
      ],
      size: 'large',
    },
  ];

  sendMessage(messages:any, event:any) {
    messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      user: {
        name: 'Jonh Doe',
        avatar: 'https://techcrunch.com/wp-content/uploads/2015/08/safe_image.gif',
      },
    });
  }

  // messages: any[];

  // constructor(protected chatShowcaseService: ChatShowcaseService) {
  //   this.messages = this.chatShowcaseService.loadMessages();
  // }

  // sendMessage(event: any) {
  //   const files = !event.files ? [] : event.files.map((file:any) => {
  //     return {
  //       url: file.src,
  //       type: file.type,
  //       icon: 'file-text-outline',
  //     };
  //   });

  //   this.messages.push({
  //     text: event.message,
  //     date: new Date(),
  //     reply: true,
  //     type: files.length ? 'file' : 'text',
  //     files: files,
  //     user: {
  //       name: 'Jonh Doe',
  //       avatar: 'https://i.gifer.com/no.gif',
  //     },
  //   });
  //   const botReply = this.chatShowcaseService.reply(event.message);
  //   if (botReply) {
  //     setTimeout(() => { this.messages.push(botReply) }, 500);
  //   }
  // }
}




// import { Component } from '@angular/core';

// @Component({
//   selector: 'nb-chat-colors',
//   templateUrl: './chat-colors.component.html',
//   styles: [`
   
//   `],
// })
// export class ChatColorsComponent {
  
// }
