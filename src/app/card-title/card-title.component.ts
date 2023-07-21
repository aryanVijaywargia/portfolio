import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import "../../assets/smtp.js"
declare let Email: any;

@Component({
  selector: 'app-card-title',
  templateUrl: './card-title.component.html',
  styleUrls: ['./card-title.component.scss']
})
export class CardTitleComponent implements OnInit {

  model:any;
  
  constructor(
    // private formBuilder: FormBuilder,
    ) {}
    reactiveForm!: FormGroup;

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      message: new FormControl(null, Validators.required),
    }) 
  }

  @Output() faceSmile = new EventEmitter<boolean>(false);

  changeSmile(value: boolean) {
    this.faceSmile.emit(value);
  }

  

  onSubmit(event:any){
    console.log(this.reactiveForm)
    event.preventDefault();


    this.model = this.reactiveForm.value;

    console.log(this.model.email)

    Email.send({
      Host : "smtp.elasticemail.com",
      Username : "aryanvijaywargia@gmail.com",
      Password : "3BC9D11B809EC7BD412162DE115D5A7CBAEC",  //3BC9D11B809EC7BD412162DE115D5A7CBAEC
      To : "aryanvijaywargia@gmail.com",
      From : "aryanvijaywargia@gmail.com",
      Subject : "New Contact Form Enquiry",
      Body : `
      <i>This is sent as a feedback from my resume page.</i> <br/> <b>Name: </b>${this.model.name} <br /> <b>Email: </b>${this.model.email}<br /> <b>Message:</b> <br /> ${this.model.message} <br><br> <b>~End of Message.~</b> `
      }).then( console.log("Message sent")  );
      
  }

}
