import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss']
})
export class RangeSliderComponent {
  
  

  // @ViewChild('slider') sliderRef!: ElementRef<HTMLInputElement>;
  // @Output() sliderVal = new EventEmitter<string>();
  // rangeVal:string='Medium';
  // ngAfterViewInit() {
  //   const slider = this.sliderRef.nativeElement;

  //   // Define the positions of the options on the slider
  //   const option1 = 0;
  //   const option2 = 4;
  //   const option3 = 9;

  //   // Snap the slider to the nearest option
  //   slider.addEventListener('change', () => {
  //     let value = parseInt(slider.value);
  //     value = Math.round(value/11);
  //     let snappedValue;

  //     if (value <= (option1 + option2) / 2) {
  //       snappedValue = option1;
  //       this.rangeVal = 'Small';
  //     } else if (value <= (option2 + option3) / 2) {
  //       snappedValue = option2;
  //       this.rangeVal = 'Medium';
  //     } else {
  //       snappedValue = option3;
  //       this.rangeVal = 'Large';
  //     }
  //     // Update the slider value to the snapped value
  //     snappedValue = Math.round(snappedValue*11);
  //     slider.value = snappedValue.toString();

  //     // slider.style.setProperty('--slider-value', snappedValue.toString());

  //   });
  // }



  // updateSliderValue(value: string) {
  //   this.sliderVal.emit(value);
  // }

  //no JS necessary
// $(function () {
// 	$('form').submit(function(e) {
// 		e.preventDefault();
// 	});
// });
  
}




