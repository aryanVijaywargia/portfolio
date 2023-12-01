import { Component, HostListener, Renderer2 } from '@angular/core';
import { ThemeService } from './theme.service';
import { Subscription } from 'rxjs';
import * as AOS from 'aos';
import { Router, NavigationEnd } from '@angular/router';
import { ScrollSpyService } from './scroll-spy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // constructor (){};

  ngOnInit(){
    AOS.init()
    // this.router.events.subscribe((event) => {
    document.body.classList.remove('nb-theme-dark'); 
  // });
  }

//   ngOnInit(): void {
    
// }

  receivedTheme: any;
  private subscription: Subscription;

  constructor(private themeService: ThemeService, private router: Router,private renderer: Renderer2, private scrollSpyService: ScrollSpyService) {
    this.subscription = this.themeService.sharedData$.subscribe(data => {
      this.receivedTheme = data;
    });
  }

  

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  title = 'portfolio';

}
