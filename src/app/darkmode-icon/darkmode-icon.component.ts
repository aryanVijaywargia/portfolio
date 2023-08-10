import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
// import { ThemeService } from 'your-theme-service'; // Replace with your theme service import
// import { AnimationOptions, motion } from 'framer-motion';

@Component({
  selector: 'app-darkmode-icon',
  templateUrl: './darkmode-icon.component.html',
  styleUrls: ['./darkmode-icon.component.scss'],
  

})
export class DarkmodeIconComponent {
  isDarkMode: boolean = false;

  myFunction(): void {
    const body = document.querySelector('body');
    const toggle = document.getElementById('toggle');
    const toggleBtn = document.getElementById('toggle-btn');
    const shape = document.getElementById('shape');
    const icon1 = document.getElementById('change-icon1');
    const icon2 = document.getElementById('change-icon2');

    this.isDarkMode = !this.isDarkMode;

    // body?.classList.toggle('body-dark', this.isDarkMode);
    toggle?.classList.toggle('toggle-dark', this.isDarkMode);
    toggleBtn?.classList.toggle('span-dark', this.isDarkMode);
    shape?.classList.toggle('shape-style', this.isDarkMode);

    if (icon1 && icon2) {
      if (this.isDarkMode) {
        icon1.classList.add('moon-icon');
        icon2.classList.add('sun-icon');
      } else {
        icon1.classList.remove('moon-icon');
        icon2.classList.remove('sun-icon');
      }
    }
  }
}
