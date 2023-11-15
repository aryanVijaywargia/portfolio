import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dark-mode-nav',
  templateUrl: './dark-mode-nav.component.html',
  styleUrls: ['./dark-mode-nav.component.scss']
})
export class DarkModeNavComponent  {

  // sq1 = document.getElementById("sq1");
  // sq2 = document.getElementById("sq2");
  // cbig = document.getElementById("cbig");
  // csmall = document.getElementById("csmall");
  // btn = document.getElementById("btn");
  // btn.addEventListener("click", function(){
  //   sq1.classList.toggle("active2");
  //   sq2.classList.toggle("active2");
  //   cbig.classList.toggle("active2");
  //   csmall.classList.toggle("active2");
  // });

  constructor(public themeService:ThemeService){}
  subscription!:Subscription;
  isActive!: boolean;

  ngOnInit(){
    this.subscription = this.themeService.booleanValue$.subscribe(value => {
      this.isActive = value;
      // this.toggleActive();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  toggleActive() {
    this.themeService.setData(!this.isActive);
  }

  
  
}
