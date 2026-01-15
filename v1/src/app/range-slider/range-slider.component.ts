import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ThemeService } from '../shared/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent {
  receivedTheme!: boolean;
  private subscription: Subscription;
  constructor(private themeService: ThemeService) {
    this.subscription = this.themeService.sharedData$.subscribe(data => {
      this.receivedTheme = data;
    });
  }











  @Output() selectedValueChange = new EventEmitter<string>();
  selectedValue: string = "Medium";


  onInputChange(value: string) {
    this.selectedValue = value;
    this.selectedValueChange.emit(this.selectedValue);
  }

}




