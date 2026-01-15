import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardTitleComponent } from './card-title/card-title.component';
import { ExperienceComponent } from './experience/experience.component';
import { FaceComponent } from './face/face.component';
import { ClarityModule } from '@clr/angular';
import { TransitionDirective } from './shared/directives/transition.directive';
import { ProjectComponent } from './project/project.component';
import { ScrollGalleryComponent } from './shared/components/scroll-gallery/scroll-gallery.component';
import { ImageComponent } from './shared/components/image/image.component';
import { AboutComponent } from './about/about.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { RangeSliderComponent } from './range-slider/range-slider.component';
import { HeroTerminalComponent } from './hero-terminal/hero-terminal.component';
import { TimelineComponent } from './time-line/time-line.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TerminalNewComponent } from './terminal-new/terminal-new.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DemoCardComponent } from './demo-card/demo-card.component';
import { DarkmodeIconComponent } from './darkmode-icon/darkmode-icon.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { NbChatModule, NbIconModule, NbLayoutModule, NbSidebarModule, NbThemeModule } from '@nebular/theme';
import { ChatbotUiComponent } from './chatbot-ui/chatbot-ui.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { BadgeComponent } from './badge/badge.component';
import { RouterModule, Routes } from '@angular/router';
import { ScrollPositionDirective } from './shared/directives/scroll-position.directive';
import { BurgerMenuComponent } from './burger-menu/burger-menu.component';
import { HamburgerIconComponent } from './hamburger-icon/hamburger-icon.component';
import { CardSubmitButtonComponent } from './card-submit-button/card-submit-button.component';

library.add(fab);


const routes: Routes = [
  { path: '', component: HeroSectionComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FaceComponent,
    CardTitleComponent,
    ExperienceComponent,
    TransitionDirective,
    ProjectComponent,
    ScrollGalleryComponent,
    ImageComponent,
    AboutComponent,
    HeroSectionComponent,
    RangeSliderComponent,
    HeroTerminalComponent,
    TimelineComponent,
    TerminalNewComponent,
    DemoCardComponent,
    DarkmodeIconComponent,
    FooterComponent,
    ChatbotUiComponent,
    BadgeComponent,
    ScrollPositionDirective,
    BurgerMenuComponent,
    HamburgerIconComponent,
    CardSubmitButtonComponent
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
  ],
  exports: [CommonModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
