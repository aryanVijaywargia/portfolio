// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-terminal-new',
//   templateUrl: './terminal-new.component.html',
//   styleUrls: ['./terminal-new.component.scss']
// })
// export class TerminalNewComponent {

// }


import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, AfterViewChecked, ViewChild, ViewEncapsulation, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-terminal-new',
  templateUrl: './terminal-new.component.html',
  styleUrls: ['./terminal-new.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TerminalNewComponent implements OnInit, AfterViewChecked {
  private terminalCommands: string[] = [];
  private gitIndex = 0;
  private isPwd = false;
  private isPw = false;
  private pwd = false;

  textValue = '';

  // ngAfterViewChecked() {
  //   this.before.nativeElement.parentNode.scrollTop = this.before.nativeElement.parentNode.scrollHeight;
  //   this.cdRef.detectChanges();
  // }



  @ViewChild('cursor', { static: true })  cursor!: ElementRef;
  @ViewChild('typer', { static: true })  typer!: ElementRef;
  @ViewChild('before', { static: true })  before!: ElementRef;
  @ViewChild('liner', { static: true })  liner!: ElementRef;
  @ViewChild('texter', { static: true })  texter!: ElementRef;
  // private password = 'your_password_here'; // Replace 'your_password_here' with the actual password

  // @ViewChild('texter') texter!: ElementRef;


private  youtube = "https://www.youtube.com/fknight/";
private twitter = "https://www.twitter.com/forrestpknight/";
private password = "aryancodes";
private linkedin = "https://www.linkedin.com/in/forrestpknight/";
private instagram = "https://www.instagram.com/forrestpknight/";
private github = "https://github.com/forrestknight/";
private email = 'mailto:forrest@aryancodes.com';

whois = [
  "<br>",
  "Hey, I'm Forrest!👋",
  "I'm a software developer and content creator, who builds engaging websites like this one",
  "and makes YouTube videos about computer science & software engineering.",
  "After graduating with a Bachelor's in Computer Science, I worked professionally",
  "as a software engineer building enterprise web applications for Fortune 500 companies.",
  "While doing all of that, I documentned my coding journey on YouTube - trying to enlighten",
  "the next generation of developers and help them navigate the crazy world that is software", "development & computer science.",
  "Before I knew it, that online presence took on a life of its own, to the point where I knew",
  "I needed to make the jump from software engineering to full time content creator, and it's",
  "the best decision I ever made.",
  "Now, I make videos about creating cool shit like this terminal website, and hosting my",
  "podcast 'Decoded w/ Forrest Knight.' What most people don't know, and will only know",
  "because they're reading this right now, is that I also run a creative & media agency.",
  "We partner with clients to drive their business outcomes using modern marketing strategies.",
  "<br>"
];

whoami = [
  "<br>",
  "The paradox of “Who am I?” is: we never know, but, we constantly find out.",
  "<br>"
];

social = [
  "<br>",
  'youtube        <a href="' + this.youtube + '" target="_blank">youtube/fknight' + "</a>",
  'twitter        <a href="' + this.twitter + '" target="_blank">twitter/forrestpknight' + '</a>',
  'linkedin       <a href="' + this.linkedin + '" target="_blank">linkedin/forrestpknight' + "</a>",
  'instagram      <a href="' + this.instagram + '" target="_blank">instagram/forrestpknight' + '</a>',
  'github         <a href="' + this.github + '" target="_blank">github/forrestknight' + "</a>",
  "<br>"
];

 secret = [
  "<br>",
  '<span class="command">sudo</span>           Only use if you\'re admin',
  "<br>"
];

 projects = [
  "<br>",
  "Still curating... most projects are offline, on GitHub, or confidential.",
  "<br>"
];

help = [
  "<br>",
  '<span class="command">whois</span>          Who is Aryan?',
  '<span class="command">whoami</span>         Who are you?',
  // '<span class="command">video</span>          View YouTube videos',
  '<span class="command">social</span>         Display social networks',
  '<span class="command">secret</span>         Find the password',
  '<span class="command">projects</span>       View coding projects',
  '<span class="command">history</span>        View command history',
  '<span class="command">help</span>           duh',
  '<span class="command">email</span>          Do not email me',
  '<span class="command">clear</span>          Clear terminal',
  '<span class="command">banner</span>         Display the header',
  "<br>",
];

initial = [
  "<span class=\"inherit\">Hello. For a list of commands, type <span class=\"command\">'help'</span>.</span>"
]

  constructor(private cdRef : ChangeDetectorRef, private renderer: Renderer2) { }

  ngOnInit() {
    setTimeout(() => {
      this.loopLines(this.initial, "color2 pCls", 80);
      console.log(this.texter);
      this.texter.nativeElement!.focus();
    }, 100);
  }

   $(elid: string): HTMLElement | null {
    return document.getElementById(elid);
  }

  // private nl2br(txt: string): string {
  //   return txt.replace(/\n/g, '');
  // }

   typeIt( e:KeyboardEvent) {
    e = e || window.event;
    const w = this.typer.nativeElement;
    const tw = this.textValue;
    console.log(this.textValue);
    if (!this.isPwd) {
      w!.innerHTML = this.nl2br(tw);
    }
  }

   moveIt(count: number, e: KeyboardEvent) {
    e = e || window.event;
    const keycode = e.keyCode || e.which;
    if (keycode == 37 && parseInt(this.cursor!.nativeElement.style.left) >= (0 - ((count - 1) * 10))) {
      this.cursor!.nativeElement.style.left = parseInt(this.cursor!.nativeElement.style.left) - 10 + "px";
    } else if (keycode == 39 && (parseInt(this.cursor!.nativeElement.style.left) + 10) <= 0) {
      this.cursor!.nativeElement.style.left = parseInt(this.cursor!.nativeElement.style.left) + 10 + "px";
    }
  }

   alert(txt: string) {
    console.log(txt);
  }

  ngAfterViewChecked() {
    // this.scrollTerminalToBottom();
  }
  

  scrollTerminalToBottom() {
    const terminalContainer = this.before.nativeElement.parentNode;
    // terminalContainer.scrollTop = terminalContainer.scrollHeight;
    this.renderer.setProperty(terminalContainer, 'scrollTop', terminalContainer.scrollHeight);
  }





  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode == 181) {
      document.location.reload();
    }

    if (this.isPw) {
      const et = "*";
      const w = this.textValue.length;
      this.typer!.nativeElement.innerHTML = et.repeat(w);
      if (this.textValue === this.password) {
        this.pwd = true;
      }

      if (this.pwd && event.keyCode == 13) {
        this.loopLines(this.social, "color2 margin pCls", 120);
        this.typer!.nativeElement.innerHTML = "";
        this.textValue = "";
        this.pwd = false;
        this.isPw = false;
        this.liner!.nativeElement.classList.remove("password");
      } else if (event.keyCode == 13) {
        this.addLine("Wrong password", "error", 0);
        this.typer!.nativeElement.innerHTML = "";
        this.textValue = "";
        this.isPw = false;
        this.liner!.nativeElement.classList.remove("password");
      }
    } else {
      if (event.keyCode == 13) {
        this.terminalCommands.push(this.typer!.nativeElement!.innerHTML);
        this.gitIndex = this.terminalCommands.length;
        this.addLine(
          "visitor@aryancodes.com:~$ " + this.typer!.nativeElement!.innerHTML,
          "no-animation",
          0
        );
        this.commander(this.typer!.nativeElement.innerHTML.toLowerCase());
        this.typer!.nativeElement.innerHTML = "";
        this.textValue = "";
      }
      if (event.keyCode == 38 && this.gitIndex != 0) {
        this.gitIndex -= 1;
        this.textValue = this.terminalCommands[this.gitIndex];
        this.typer!.nativeElement.innerHTML = this.textValue;
      }
      if (event.keyCode == 40 && this.gitIndex != this.terminalCommands.length) {
        this.gitIndex += 1;
        if (this.terminalCommands[this.gitIndex] === undefined) {
          this.textValue = "";
        } else {
          this.textValue = this.terminalCommands[this.gitIndex];
        }
        this.typer!.nativeElement.innerHTML = this.textValue;
      }
    }
  }

  commander(cmd: string) {
    switch (cmd.toLowerCase()) {
      case "help":
        this.loopLines(this.help, "color2 margin pCls", 80);
        // this.scrollTerminalToBottom();
        break;
      case "whois":
        this.loopLines(this.whois, "color2 margin pCls", 80);
        break;
      case "whoami":
        this.loopLines(this.whoami, "color2 margin pCls", 80);
        break;
      case "video":
        this.addLine("Opening YouTube...", "color2", 80);
        this.newTab('your_youtube_link_here'); // Replace 'your_youtube_link_here' with the actual YouTube link
        break;
      default:
        this.addLine(
          "<span class=\"inherit\">Command not found. For a list of commands, type <span class=\"command\">'help'</span>.</span>",
          "error",
          100
        );
        break;
    }
  }

  newTab(link: string) {
    setTimeout(() => {
      window.open(link, "_blank");
    }, 500);
  }

  addLine(text: string, style: string, time: number) {
    let t = "";
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
        t += "&nbsp;&nbsp;";
        i++;
      } else {
        t += text.charAt(i);
      }
    }
    setTimeout(() => {
      const next = document.createElement("p");
      next.innerHTML = t;
      next.className = style;
      // const container = this.before.nativeElement.parentNode;

      this.before!.nativeElement.parentNode!.insertBefore(next, this.before.nativeElement);
      // window.scrollTo(0, document.body.offsetHeight);
      // this.before.nativeElement.parentNode.scrollTop = this.before.nativeElement.parentNode.scrollHeight;
      this.scrollTerminalToBottom(); 
    }, time);
    
  }

  loopLines(name: string[], style: string, time: number) {
    name.forEach((item, index) => {
      this.addLine(item, style, index * time);
    });
    
  }

  nl2br(txt: string) {
    return txt.replace(/\n/g, '');
  }

  // @HostListener('window:load', ['$event'])
  // init() {
  //   this.cursor!.nativeElement.style!.left = "0px";
  // }

  // get before(): HTMLElement | null {
  //   return document.getElementById("before");
  // }

  // get liner(): HTMLElement | null {
  //   return document.getElementById("liner");
  // }

  // get command(): HTMLElement | null {
  //   return document.getElementById("typer");
  // }

  // get textarea(): HTMLTextAreaElement | null {
  //   return document.getElementById("texter") as HTMLTextAreaElement;
  // }

  // get terminal(): HTMLElement | null {
  //   return document.getElementById("terminal");
  // }

  // get cursor(): HTMLElement | null {
  //   return document.getElementById("cursor");
  // }
}
