import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { fadeOutLeftAnimation, fadeOutLeftOnLeaveAnimation, rotateOutUpLeftAnimation, rotateOutUpLeftOnLeaveAnimation } from 'angular-animations';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',

  animations: [
    trigger('imageAnimation', [
      state('active', style({
        transform: 'translateX(-200%)',
        filter: 'grayscale(0%)',
      })),
      state('almostActive', style({
      })),
      state('inactive', style({
        filter: 'grayscale(100%)',
      })),
      transition('inactive => almostActive', animate('500ms ease-in-out')),
      transition('almostActive => active', animate('500ms ease-in-out')),
      transition('active => inactive', animate('500ms ease-in-out')),
    ])
  ]


})
export class ImageComponent {
  @Input() pixelDensity = 1;
  @Input() preload!: boolean;
  @Input() src!: string;
  @Input() alt!: any;
  @Input() key!: string;
  @Input() width!: any;
  @Input() height!: any;
  @Input() maxWidth!: any;
  @Input() maxHeight!: any;
  @Input() aspectRatio!: number;
  rotationAngles: string[] = [];

  @Input() images: any;
  currentIndex = -1;


  onAnimationDoneFlag = false;

  showImage: boolean = false;

  activeTooltipIndex: number | null = null;
  parentContainerWidth: any;

  showTooltip(index: number) {
    this.activeTooltipIndex = index;
  }

  hideTooltip() {
  }

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.parentContainerWidth = this.el.nativeElement.parentElement.clientWidth;
  }


  getZIndex(index: number): number {
    const activeIndex = this.currentIndex;
    const almostActiveIndex = (this.currentIndex + 1) % this.images.length;

    if (index === activeIndex) {
      return this.images.length + 2; // Higher z-index for active image
    } else if (index === almostActiveIndex) {
      return this.images.length + 1; // Higher z-index for almostActive image
    } else {
      return this.images.length - index; // Lower z-index for inactive images
    }
  }

  getRotationAngle(index: number): string {
    const numImages = this.images.length;

    const centerIndex = Math.floor(numImages / 2);
    const distanceFromCenter = Math.abs(index - centerIndex);
    const rotationAngle = distanceFromCenter * 4;

    if (this.rotationAngles[index]) {
      return this.rotationAngles[index];
    }
    const angle = (index < centerIndex) ? `-${rotationAngle}deg` : `${rotationAngle}deg`;

    this.rotationAngles[index] = angle;

    return angle;
  }


  calculateRotationAngle(index: number): string {
    const numImages = this.images.length;
    const centerIndex = Math.floor(numImages / 2);
    const distanceFromCenter = Math.abs(index - centerIndex);
    const rotationAngle = distanceFromCenter * 15;

    return (index < centerIndex) ? `-${rotationAngle}deg` : `${rotationAngle}deg`;
  }



  getAnimationState(index: number): string {
    if (index === this.currentIndex) {
      return 'active';
    } else if (index === (this.currentIndex + 1) % this.images.length) {
      return 'almostActive';
    } else {
      return 'inactive';
    }
  }




  showNextImage() {
    if (this.onAnimationDoneFlag) {
      this.showImage = !this.showImage;
      this.onAnimationDoneFlag = false;
    }
  }

  showPreviousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  ngOnInit() {

  }


  calculateWidth(): string {
    const aspect = this.aspectRatio ?? +this.width / +this.height;
    const maxWidth = this.maxWidth ? +this.maxWidth : this.maxHeight ? +this.maxHeight * aspect : +this.width;
    const percentageWidth = (maxWidth * this.pixelDensity / this.parentContainerWidth) * 100; // Assuming parentContainerWidth is available
    console.log(percentageWidth)
    return Math.round(percentageWidth) + '%';

  }

  calculateHeight(): number {
    const aspect = this.aspectRatio ?? +this.width / +this.height;
    const maxHeight = this.maxHeight ? +this.maxHeight : this.maxWidth ? +this.maxWidth / aspect : +this.height;
    return Math.round(maxHeight * this.pixelDensity);
  }

  get objectFitStyle(): string {
    if (this.aspectRatio) {
      if (this.aspectRatio > 1) {
        return 'contain';
      } else {
        return 'cover';
      }
    }
    return 'initial';
  }




  toggleImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;

  }




}
