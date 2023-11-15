import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NbThemeModule, NbThemeService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-chatbot-ui',
  templateUrl: './chatbot-ui.component.html',
  styleUrls: ['./chatbot-ui.component.scss'],
  // encapsulation: ViewEncapsulation. Emulated
})
export class ChatbotUiComponent implements AfterViewInit{

  @ViewChild('nbChat', { static: true }) nbChat!: ElementRef;
  projTheme: any;
  // private subscription: Subscription
  
  constructor(private themeService: NbThemeService, private renderer: Renderer2, private projThemeService: ThemeService) {
    // this.subscription = 
    
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
      this.addThemeClass();
    });
  }
  

  ngAfterViewInit() {
    // Assuming you want to add the class after the view has been initialized
    // this.addThemeClass();
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
