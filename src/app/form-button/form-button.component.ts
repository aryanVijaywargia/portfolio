import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-form-button',
  templateUrl: './form-button.component.html',
  styleUrls: ['./form-button.component.scss'],
  animations: [
    trigger('animationTrigger', [
      state('active', style({ transform: 'scale(1.1)' })),
      transition('* => active', [animate('0.3s ease-out')]),
    ]),
  ],

})
export class FormButtonComponent {
  // btnAnimation() {
  //   let btn = document.getElementById("btn");
  //   let check = document.getElementById("check");

  //   if (btn && check) {
  //     btn.classList.add("btnAnimation");
  //     check.classList.add("checkAnimation");

  //     setTimeout( () =>{
  //       btn!.classList.remove("btnAnimation");
  //       check!.classList.remove("checkAnimation");
  //     }, 3000);
  //   }
  // }

  animationState: string = '';

  btnAnimation() {
    this.animationState = 'active';

    setTimeout(() => {
      this.animationState = '';
    }, 300);
  }

}
