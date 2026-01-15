import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card-submit-button',
  templateUrl: './card-submit-button.component.html',
  styleUrls: ['./card-submit-button.component.scss']
})
export class CardSubmitButtonComponent {


  @ViewChild('jsBtn') jsBtn!: ElementRef;
  @ViewChild('jsTimer') jsTimer!: ElementRef;
  @Input() buttonReactiveForm!:any;
  triggerErrorClass: boolean=false;
  doSubmit() {
    const button = this.jsBtn.nativeElement;
    const timer = this.jsTimer.nativeElement;

    console.log(this.buttonReactiveForm)

    if (button.classList.contains('do-submit')) { return; }

    button.classList.add('do-submit');


    
    setTimeout(() => this.doTimer(0), 1200);
    
    if(this.buttonReactiveForm.controls.name.value || this.buttonReactiveForm.controls.message.value || this.buttonReactiveForm.controls.email.status=="VALID"){
      setTimeout(() => this.doTimer(15), 1200);
      
    }
    else{
      setTimeout(() => this.triggerErrorClass=true, 1200);
      setTimeout(() => button.classList.remove('do-submit'), 1200);
      setTimeout(() => button.classList.add('do-error'), 1200);
      setTimeout(() => this.jsBtn.nativeElement.style.top = '0%', 1200);
      
    }
    

    if((this.buttonReactiveForm.controls.name.value && this.buttonReactiveForm.controls.message.value) || (this.buttonReactiveForm.controls.email.status=="VALID" && this.buttonReactiveForm.controls.message.value) || (this.buttonReactiveForm.controls.name.value && this.buttonReactiveForm.controls.email.status=="VALID")){
      setTimeout(() => this.doTimer(60), 2000);
    }
    else{
      
      setTimeout(() => this.triggerErrorClass=true, 2000);
      setTimeout(() => button.classList.remove('do-submit'), 2000);
      setTimeout(() =>  button.classList.add('do-error'), 2000);
      setTimeout(() => this.jsBtn.nativeElement.style.top = '0%', 2000);
    }
    

    if(this.buttonReactiveForm.controls.name.value && this.buttonReactiveForm.controls.message.value && this.buttonReactiveForm.controls.email.status=="VALID"){
      setTimeout(() => this.doTimer(100), 2800);
    }
    else{
      setTimeout(() => this.triggerErrorClass=true, 2800);
      setTimeout(() => button.classList.remove('do-submit'), 2800);
      setTimeout(() => button.classList.add('do-error'), 2800);
      setTimeout(() => this.jsBtn.nativeElement.style.top = '0%', 2800);
    }
   
    
    
    setTimeout(() => this.resetButton(), 5000);
  }

  doTimer(amountLoaded: number) {
    const timerElement = this.jsTimer.nativeElement;
    
    timerElement.style.strokeDashoffset = (3.83 * (100 - amountLoaded)) + 'px';
    this.jsBtn.nativeElement.style.top = '25%';
    if (amountLoaded === 100) {
      this.jsBtn.nativeElement.style.top = '0%';
      setTimeout(() => this.jsBtn.nativeElement.classList.add('success'), 500);
      this.onButtonClick();
      this.triggerErrorClass=false
    }
  }

  resetButton() {
    const button = this.jsBtn.nativeElement;
    const timer = this.jsTimer.nativeElement;

    button.classList.add('reset');
    setTimeout(() => {
      button.classList.remove('success');
      button.classList.remove('do-submit');
      button.classList.remove('do-error');
      button.classList.remove('error');
      button.classList.remove('reset');
      this.triggerErrorClass=false;
    }, 500);

    timer.style.strokeDashoffset = '383px';
  }

  @Output() submitClicked: EventEmitter<void> = new EventEmitter<void>();

  onButtonClick() {
    this.submitClicked.emit();
  }

 





}

