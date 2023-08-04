import { Component, Input } from '@angular/core';
import { PhoneComponent } from '../phone/phone.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
})
export class ImageComponent {
  @Input() pixelDensity = 1;
  @Input() preload!: boolean;
  @Input() src!: string;
  @Input() alt!: string;
  @Input() key!: string;
  @Input() width!: any;
  @Input() height!: any;
  @Input() maxWidth!: any;
  @Input() maxHeight!: any;
  @Input() aspectRatio!: number;


  ngOnInit(){
    
  }

  calcSrc(){
    const imgSrc = typeof this.src === 'string' ? this.src.replace(/^(http:)?\/\//, 'https://') : this.src
    return imgSrc;
  }

  calculateWidth(): number {
    const aspect = this.aspectRatio ?? +this.width / +this.height;
    const maxWidth = this.maxWidth ? +this.maxWidth : this.maxHeight ? +this.maxHeight * aspect : +this.width;
    return Math.round(maxWidth * this.pixelDensity);
  }

  calculateHeight(): number {
    const aspect = this.aspectRatio ?? +this.width / +this.height;
    const maxHeight = this.maxHeight ? +this.maxHeight : this.maxWidth ? +this.maxWidth / aspect : +this.height;
    return Math.round(maxHeight * this.pixelDensity);
  }

  get objectFitStyle(): string {
    // Set the object-fit style based on the aspect ratio
    if (this.aspectRatio) {
      if (this.aspectRatio > 1) {
        return 'contain';
      } else {
        return 'cover';
      }
    }
    return 'initial';
  }
}
