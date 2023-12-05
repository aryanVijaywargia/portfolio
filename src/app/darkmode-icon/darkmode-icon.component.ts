import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewEncapsulation } from '@angular/core';
import { ThemeService } from '../theme.service';
// import { ThemeService } from 'your-theme-service'; // Replace with your theme service import
import { Subscription } from 'rxjs';
import { ChatbotToggleService } from '../chatbot-toggle.service';
// import { AnimationOptions, motion } from 'framer-motion';

@Component({
  selector: 'app-darkmode-icon',
  templateUrl: './darkmode-icon.component.html',
  styleUrls: ['./darkmode-icon.component.scss'],
  // encapsulation: ViewEncapsulation.None,


})
export class DarkmodeIconComponent {
  isLightMode!: boolean;
  subscription!: Subscription;
  chatToggle: boolean=false;
  // constructor(){

  // }

  constructor(private themeService:ThemeService ,private chatbotToggleService: ChatbotToggleService) {
    this.subscription = this.chatbotToggleService.command$.subscribe((command) => {
      this.chatToggle = command
    });

  }

  toggleChat() {
    this.chatToggle = !this.chatToggle;
    this.chatbotToggleService.sendCommand(this.chatToggle);
    // console.log(this.chatToggle)
  }


  ngOnInit(){
    this.subscription = this.themeService.booleanValue$.subscribe(value => {
      this.isLightMode = value;
      const toggle = document.getElementById('toggle');
      const toggleBtn = document.getElementById('toggle-btn');
      const shape = document.getElementById('shape');
      toggle?.classList.toggle('toggle-dark', this.isLightMode);
      toggleBtn?.classList.toggle('span-dark', this.isLightMode);
      shape?.classList.toggle('shape-style', this.isLightMode);
    });

    

  }

  // toggleChat():void{

  // }

  myFunction(): void {
    const body = document.querySelector('body');
    const toggle = document.getElementById('toggle');
    const toggleBtn = document.getElementById('toggle-btn');
    const shape = document.getElementById('shape');
    const icon1 = document.getElementById('change-icon1');
    const icon2 = document.getElementById('change-icon2');

    this.isLightMode = !this.isLightMode;

    // body?.classList.toggle('body-dark', this.isDarkMode);
    toggle?.classList.toggle('toggle-dark', this.isLightMode);
    toggleBtn?.classList.toggle('span-dark', this.isLightMode);
    shape?.classList.toggle('shape-style', this.isLightMode);

    if (icon1 && icon2) {
      if (this.isLightMode) {
        icon1.classList.add('moon-icon');
        icon2.classList.add('sun-icon');
      } else {
        icon1.classList.remove('moon-icon');
        icon2.classList.remove('sun-icon');
      }
    }
    this.themeService.setData(this.isLightMode);
  }
}
