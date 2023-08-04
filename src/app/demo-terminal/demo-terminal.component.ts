import { Component, ElementRef, Renderer2, ViewChild, InjectionToken, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-demo-terminal',
  templateUrl: './demo-terminal.component.html',
  styleUrls: ['./demo-terminal.component.scss']
})
// export class DemoTerminalComponent implements OnInit, AfterViewInit {
//   userInput: string = '';
//   // terminalOutput: string = '';
//   @ViewChild('terminalOutput') terminalOutput!: ElementRef;

//   COMMANDS:any = {
//     help:
//       'Supported commands: ["<span class="code">about</span>", "<span class="code">experience</span>", "<span class="code">education</span>", "<span class="code">skills</span>", "<span class="code">contact</span>"]',
//     about: '...',
//     skills: '...',
//     education: '...',
//     experience: '...',
//     contact: '...',
//     bob: '<span style="font-size: 2rem;">🐕</span>',
//     party: '🎉🎉🎉',
//     beer: '...',
//     'sudo rm -rf': '',
//   };
//   constructor(private el: ElementRef, private renderer: Renderer2, private sanitizer: DomSanitizer) {}

  

//   ngOnInit() {
//     // this.terminalOutput.nativeElement.focus();

//   }

//   ngAfterViewInit(): void {
//     // The terminalOutput ElementRef is available here.
//     this.terminalOutput.nativeElement.focus();
//   }

//   handleKeyboardEvents(event: KeyboardEvent) {
//     if (event.key === 'Enter') {
//       this.executeCommand(this.userInput);
//       this.userInput = '';
//       return;
//     }
//     this.userInput += event.key;
//     console.log(this.userInput);
//   }

//   executeCommand(input: string) {
//     let output;
//     input = input.toLowerCase();

//     if (input.length === 0) {
//       return;
//     }

//     if (input === 'party') {
//       this.startTheParty();
//     }

//     if (input === 'sudo rm -rf') {
//       this.whooops();
//     }

//     output = `<div class="terminal-line"><span class="success">➜</span> <span class="directory">~</span> ${input}</div>`;
//     if (!this.COMMANDS.hasOwnProperty(input)) {
//       output += `<div class="terminal-line">no such command: <span class="output">"${input}"</span></div>`;
//     } else {
//       output += `<div class="output"> ${this.COMMANDS[input]} </div>`;
//     }

//     // this.terminalOutput.nativeElement.inner = `${this.terminalOutput}<div class="terminal-line">${output}</div>`;
//     this.terminalOutput.nativeElement.innerHTML = `${this.terminalOutput.nativeElement.innerHTML}<div class="terminal-line">${output}</div>`;

//   }
//   getSafeHTML(html: any): SafeHtml {
//     return this.sanitizer.bypassSecurityTrustHtml(html);
//   }

  
//   focusKeyboard() {
//     const dummyKeyboard = this.el.nativeElement.querySelector('#dummyKeyboard');
//     this.renderer.selectRootElement(dummyKeyboard).focus();
//   }
//   // focusKeyboard() {
//   //   // You'll need to use Angular's Renderer2 for this.
//   // }

//   startTheParty() {
//     // Implement confetti logic.
//     console.log("Party")
//   }

//   whooops() {
//     // Implement this logic.
//     console.log("Hello guys")
//   }

// }


export class DemoTerminalComponent {

}