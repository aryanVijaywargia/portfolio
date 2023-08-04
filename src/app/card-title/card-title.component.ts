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
  submitted:boolean = false;
  lastSubmit = {
    email: false,
    name: false,
    message: false
  };

  focused:any = {
    email: false,
    username: false,
    message: false
  }

  

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

  onFocus(field: string): void {
    this.focused[field] = true;
  }
  onBlur(field: string): void {
    this.focused[field] = false;
  }
  

  onSubmit(event:any){
    console.log(this.reactiveForm)
    this.lastSubmit.email = this.reactiveForm.controls['email'].invalid;
    this.lastSubmit.name = this.reactiveForm.controls['name'].invalid;
    this.lastSubmit.message = this.reactiveForm.controls['message'].invalid;

    this.submitted=true;
    if (this.reactiveForm.invalid) {
      this.reactiveForm.markAllAsTouched();
      // this.submitted=false;
    } else {
      // carry out your submission logic here  
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

        this.reactiveForm.reset();

        // Reset flags
        this.submitted = false;
        this.focused = {
          email: false,
          name: false,
          message: false,
        };
    }
  }
}
