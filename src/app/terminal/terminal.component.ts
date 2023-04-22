import { AfterContentInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ComponentService } from './terminal.service';
// import { CmdItem } from '../command-item';
// import { CmdDirective } from '../command.directive';
// import { CmdComponent } from '../command.component';
// import { CmdService } from '../command.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {

  // @ViewChild('titleContainer', { static: true }) public titleContainer: any;
  // public newTitleElem: any;
  // public title: string = 'This is the title';
  // public element!: string;
  // public headingTags = [
  //   { title_size: "h1" },
  //   { title_size: "h2" },
  //   { title_size: "h3" },
  //   { title_size: "h4" },
  //   { title_size: "h5" },
  //   { title_size: "h6" }
  // ];


  // cmds: CmdItem[] = [];
  @ViewChild('myInput', {static: false}) public myInput: any;
  inputText: any=' ';
  enteredText!: any;
  // constructor(private cmdService: CmdService) {}
  constructor() {}
  ngOnInit() {
    // this.cmds = this.cmdService.getCmds();
    
  }

  // onEnter(value: string) {
  //   // Do something with the input value, such as sending it to your backend
  //   this.enteredText=this.inputText;
  // }

  // onEnter(value: string) {
  //   // Do something with the input value, such as sending it to your backend
  //   console.log(value);
  //   this.enteredText=value;

  //   // Remove focus from the input field to prevent further events
  //   this.myInput.nativeElement.blur();
  // }


  onEnter($event: any) {
    console.log("You entered: ", $event.target.value);
    this.enteredText=$event.target.value; 
  }
  


// }

// @Component({
//   selector: 'app-terminal',
//   template: `
//   <h2>Dynamic Component</h2>
//   <input [(ngModel)]="inputText"/>

//   <ng-container *ngIf="inputText === 'A'">
//     <p class="has-text-weight-bold">Hello! I'm Ashleigh 🇬🇧</p>
//     <br />
//     <p>Here's some facts about me:</p>
//     <ul>
//       <li class="is-rainbow-red">✅ Web Developer</li>
//       <li class="is-rainbow-orange">✅ App Developer</li>
//       <li class="is-rainbow-yellow">✅ TypeScript Expert</li>
//       <li className="is-rainbow-green">✅ Backend Specialist</li>
//       <li className="is-rainbow-blue">✅ EPOS Builder</li>
//       <li className="is-rainbow-violet">
//         ✅ Football Fanatic ⚽ (forza Biancazzurri!)
//       </li>
//     </ul>
//     <br />
//   </ng-container>

//     <ng-container *ngIf="inputText === 'B'">
//       <p>Component B is being displayed.</p>
//     </ng-container>

//     <ng-container *ngIf="inputText === 'C'">
//       <p>Component C is being displayed.</p>
//     </ng-container>
//   `,
//   styleUrls: ['./terminal.component.scss']
// })
// export class TerminalComponent {
//   inputText!: any;
//   htmlComponent!: any;

//   constructor(private componentService: ComponentService) {}

//   onChange() {
//     this.htmlComponent = this.componentService.getHtmlComponent(this.inputText);
//   }



}


