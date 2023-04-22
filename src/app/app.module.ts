import { NgModule } from '@angular/core';
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
import { NavbarComponent } from './header/navbar.component';

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
    
  ],
  exports:[CommonModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
