// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class TerminalService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { Terminal } from 'xterm';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
  private term: Terminal;
  private buffer: string = '';

  constructor() {
    this.term = new Terminal();
  }

  initializeTerminal(container: HTMLElement) {
    this.term.open(container);
    this.term.writeln('Hello from xterm.js! Type help to see the commands');
    this.term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
    
      if (domEvent.keyCode === 13) { // Enter
        this.handleInput(this.buffer);
        this.buffer = '';
      } else if (domEvent.keyCode === 8) { // Backspace
        if (this.buffer !== '') {
          this.buffer = this.buffer.substr(0, this.buffer.length - 1);
          this.term.write('\b \b');
        }
      } else if (printable) {
        this.buffer += key;
        this.term.write(key);
      }
    });
    
  }

  handleInput(input: string) {
    switch(input) {
      case 'info':
        this.term.writeln('\nName: Your Name\nLocation: Your Location\nStack: Your Stack');
        break;
      case 'contact_me':
        this.term.writeln('\nLinkedIn: Your LinkedIn\nGithub: Your Github');
        break;
      case 'help':
        this.term.writeln('\nCommands:\ninfo: Get information\ncontact_me: Get contact details');
        break;
      default:
        this.term.writeln(`\nUnknown command: ${input}`);
    }
    this.term.write('\n>');
  }
}
