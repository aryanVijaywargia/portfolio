// import { Component, OnInit } from '@angular/core';
// import { trigger, state, style, animate, transition } from '@angular/animations';
// import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, rotateOutUpLeftAnimation, rotateOutUpLeftOnLeaveAnimation } from 'angular-animations';

// @Component({
//   selector: 'app-image-slider',
//   templateUrl: './image-slider.component.html',
//   styleUrls: ['./image-slider.component.scss'],
//   animations: [
//   //   trigger('rotateOutUpLeft', [
//   //     state('in', style({ transform: 'rotate(0deg)', opacity: 1 })),
//   //     transition('void => *', [
//   //       style({ transform: 'rotate(0deg)', opacity: 0 }),
//   //       animate('500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')
//   //     ]),
//   //     transition('* => void', [
//   //       animate('500ms cubic-bezier(0.6, -0.28, 0.735, 0.045)', style({ transform: 'rotate(-45deg)', opacity: 0 }))
//   //     ])
//   //   ])
//   // fadeInOnEnterAnimation(),
//     // fadeOutOnLeaveAnimation()
//     rotateOutUpLeftAnimation(),
//     rotateOutUpLeftOnLeaveAnimation()
//   ]

// })
// export class ImageSliderComponent implements OnInit {
  // images: string[] = [
  //   '../../assets/quadbike.jpg',
  //   '../../assets/dont-be-a-dick.jpg',
  //   "../../assets/alpha-backpack.jpg"
  //   // Add paths to your 10 images here
  // ];
//   // this.showImage=True;
//   currentIndex: number = 0;
//   showImage:boolean=true;

//   toggleImage() {
//     this.showImage = !this.showImage;
//   }

//   ngOnInit(): void {
//     this.startImageSlideShow();
//   }

//   startImageSlideShow() {
//     setInterval(() => {
//       this.showImage = !this.showImage;
//     }, 5000);
//   }

//   onImageClick(index: number) {
//     this.currentIndex = index;
//   }

// }

import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { fadeOutLeftOnLeaveAnimation, fadeOutLeftAnimation } from 'angular-animations'; // You need to install 'ngx-animations' library for these animations

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
  animations: [
    // trigger('imageAnimation', [
    //   state('hidden', style({ opacity: 0 })),
    //   state('shown', style({ opacity: 1, transform: 'translateX(0)' })),
    //   transition('hidden => shown', animate('500ms ease-out')),
    //   transition('shown => hidden', animate('500ms ease-in')),
    // ]),
    fadeOutLeftOnLeaveAnimation(),
    fadeOutLeftAnimation(),
  ],
})
export class ImageSliderComponent {
  images = [
    { src: '../../assets/quadbike.jpg' },
    { src:  '../../assets/dont-be-a-dick.jpg' },
    { src:  "../../assets/alpha-backpack.jpg" },
    // Add more images
  ];
  // images: string[] = [
    
   
    
    // Add paths to your 10 images here
  // ];
  showImage: boolean = true;
  currentImageIndex: number = 0;

  onImageClick() {
    if (this.showImage) {
      this.showImage = false;
      setTimeout(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.showImage = true;
      }, 500); // Wait for the slide-out animation to complete
    }
  }
}
