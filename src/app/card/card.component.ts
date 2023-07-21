import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  

  constructor() { }
  @ViewChild('face', { static: false }) faceElementRef!: ElementRef;
  shouldSmile: boolean = false;

  changeFaceSmile(smile:boolean){
    this.shouldSmile = smile
  }

  ngOnInit(): void {
  }
  



}
