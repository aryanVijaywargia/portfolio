import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-demo-card',
  templateUrl: './demo-card.component.html',
  styleUrls: ['./demo-card.component.scss']
})
export class DemoCardComponent {
  constructor() { }
  @ViewChild('face', { static: false }) faceElementRef!: ElementRef;
  shouldSmile: boolean = false;

  changeFaceSmile(smile:boolean){
    this.shouldSmile = smile
  }

  ngOnInit(): void {
  }
  

}
