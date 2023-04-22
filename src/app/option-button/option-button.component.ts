// import { Component, Input, OnInit } from '@angular/core';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-option-button',
//   templateUrl: './option-button.component.html',
//   styleUrls: ['./option-button.component.scss']
// })
// export class OptionButtonComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

//   @Input() width!: number;
//   @Input() name!: string;
//   faCoffee = faCoffee;
  // @Input() onClick!: () => void;
  // @Input() onMouseEnter!: () => void;
  // @Input() onMouseLeave!: () => void;
//   @Input() condition!: boolean;
//   @Input() isMobile!: boolean;
//   @Input() disabled!: boolean | null | undefined;

// }


import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-option-button',
  templateUrl: './option-button.component.html',
  styleUrls: ['./option-button.component.scss']
})
export class OptionButtonComponent implements OnInit {
  @Input() width!: string;
  @Input() name!: string;
  @Input() icon!: any;
  @Input() onClick!: () => void;
  @Input() onMouseEnter!: () => void;
  @Input() onMouseLeave!: () => void;
  @Input() condition!: boolean;
  @Input() isMobile!: boolean;
  @Input() disabled!: boolean;

  constructor() { }

  ngOnInit(): void {
  }
}


// import { Component, Input } from '@angular/core';

// @Component({
//   selector: 'app-option-button',
//   templateUrl: './option-button.component.html',
//   styleUrls: ['./option-button.component.scss'] // Add any CSS file if required
// })
// export class OptionButtonComponentc {
//   @Input() icon!: string;
//   @Input() name!: string;
//   @Input() condition!: boolean;
//   @Input() disabled!: boolean;
//   @Input() isMobile!: boolean;
//   @Input() width!: string;

//   onClick(): void {
//     // Handle click event logic
//   }

//   onMouseEnter(): void {
//     // Handle mouse enter event logic
//   }

//   onMouseLeave(): void {
//     // Handle mouse leave event logic
//   }
  
// }
