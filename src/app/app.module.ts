import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// import {MatIconModule} from '@angular/material/icon';
// import {MatTabsModule} from '@angular/material/tabs';
import { TerminalComponent } from './terminal/terminal.component';
import { SearchComponent } from './search/search.component';
import { CardTitleComponent } from './card-title/card-title.component';
import { ExperienceComponent } from './experience/experience.component';
import { FaceComponent } from './face/face.component';
import { OptionButtonComponent } from './option-button/option-button.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { CardComponent } from './card/card.component';
import { PhoneComponent } from './phone/phone.component';
// import { NavbarComponent } from './navbar/navbar.component';
import { TabsComponent } from './tabs/tabs.component';
import { ClarityModule } from '@clr/angular';
import { TransitionDirective } from './Directives/transition.directive';
import { ProjectComponent } from './project/project.component';
import { ScrollGalleryComponent } from './scroll-gallery/scroll-gallery.component';
import { ImageComponent } from './image/image.component';
import { AboutComponent } from './about/about.component';
import { HeroComponent } from './hero/hero.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { HeroTerminalComponent } from './hero-terminal/hero-terminal.component';
// import { CodeComponent } from './code/code.component';
import { TimelineComponent } from './time-line/time-line.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DemoTerminalComponent } from './demo-terminal/demo-terminal.component';
import { TerminalNewComponent } from './terminal-new/terminal-new.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DemoCardComponent } from './demo-card/demo-card.component';
import { DarkmodeIconComponent } from './darkmode-icon/darkmode-icon.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';
// import { PrismModule } from '@ngx-prism/core';
// import { PrismModule } from '@ngx-prism/core';

// import { NgbModule, NgbNav, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { DarkModeNavComponent } from './dark-mode-nav/dark-mode-nav.component';
import { FormButtonComponent } from './form-button/form-button.component';
import { NbChatModule, NbIconModule, NbLayoutModule, NbSidebarModule, NbThemeModule } from '@nebular/theme';
import { ChatbotUiComponent } from './chatbot-ui/chatbot-ui.component';
import { ChatbotSidenavComponent } from './chatbot-sidenav/chatbot-sidenav.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { BadgeComponent } from './badge/badge.component';
import { RouterModule, Routes } from '@angular/router';
import { ScrollPositionDirective } from './scroll-position.directive';
import { BurgerMenuComponent } from './burger-menu/burger-menu.component';
import { HamburgerIconComponent } from './hamburger-icon/hamburger-icon.component';

library.add(fab);


const routes: Routes = [
  { path: '', component: HeroSectionComponent },
  // Add more routes as needed
];


@NgModule({
  declarations: [
    AppComponent,
    TerminalComponent,
    // AutofocusDirective,
    SearchComponent,
    PhoneComponent,
    NavbarComponent,
    AboutMeComponent,
    OptionButtonComponent,
    CardComponent,
    FaceComponent,
    CardTitleComponent,
    ExperienceComponent,
    TabsComponent,
    TransitionDirective,
    ProjectComponent,
    ScrollGalleryComponent,
    ImageComponent,
    AboutComponent,
    HeroComponent,
    HeroSectionComponent,
    RangeSliderComponent,
    HeroTerminalComponent,
    TimelineComponent,
    DemoTerminalComponent,
    TerminalNewComponent,
    DemoCardComponent,
    DarkmodeIconComponent,
    ImageSliderComponent,
    FooterComponent,
    DarkModeNavComponent,
    FormButtonComponent,
    ChatbotUiComponent,
    ChatbotSidenavComponent,
    BadgeComponent,
    ScrollPositionDirective,
    BurgerMenuComponent,
    HamburgerIconComponent
    // CodeComponent
  ],
  
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    NgbModule,
    ReactiveFormsModule,
    ClarityModule,
    FontAwesomeModule,
    NbChatModule,
    NbThemeModule.forRoot(),
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbEvaIconsModule,
    NbIconModule,
    RouterModule.forRoot(routes, {
      useHash: true,
      anchorScrolling: 'enabled'
    })
    // MatSidenavModule
  ],
  exports:[CommonModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
