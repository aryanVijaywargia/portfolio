import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
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
import { CodeComponent } from './code/code.component';
import { TimelineComponent } from './time-line/time-line.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DemoTerminalComponent } from './demo-terminal/demo-terminal.component';
import { TerminalNewComponent } from './terminal-new/terminal-new.component';
import { NavbarComponent } from './navbar/navbar.component';
// import { PrismModule } from '@ngx-prism/core';
// import { PrismModule } from '@ngx-prism/core';





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
    TerminalNewComponent
    // CodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatTabsModule,
    ClarityModule,
    FontAwesomeModule,
    // PrismModule
  ],
  exports:[CommonModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
