function $(elid) {
    return document.getElementById(elid);
  }
  
var cursor;
window.onload = init;

function init() {
  cursor = $("cursor");
  cursor.style.left = "0px";
}

function nl2br(txt) {
  return txt.replace(/\n/g, '');
}

function typeIt(from, e) {
  e = e || window.event;
  var w = $("typer");
  var tw = from.value;
  if (!pw){
    w.innerHTML = nl2br(tw);
  }
}

function moveIt(count, e) {
  e = e || window.event;
  var keycode = e.keyCode || e.which;
  if (keycode == 37 && parseInt(cursor.style.left) >= (0 - ((count - 1) * 10))) {
    cursor.style.left = parseInt(cursor.style.left) - 10 + "px";
  } else if (keycode == 39 && (parseInt(cursor.style.left) + 10) <= 0) {
    cursor.style.left = parseInt(cursor.style.left) + 10 + "px";
  }
}

function alert(txt) {
  console.log(txt);
}

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
    'youtube        <a href="' + youtube + '" target="_blank">youtube/fknight' + "</a>",
    'twitter        <a href="' + twitter + '" target="_blank">twitter/forrestpknight' + '</a>',
    'linkedin       <a href="' + linkedin + '" target="_blank">linkedin/forrestpknight' + "</a>",
    'instagram      <a href="' + instagram + '" target="_blank">instagram/forrestpknight' + '</a>',
    'github         <a href="' + github + '" target="_blank">github/forrestknight' + "</a>",
    "<br>"
  ];


  var before = document.getElementById("before");
  var liner = document.getElementById("liner");
  var command = document.getElementById("typer"); 
  var textarea = document.getElementById("texter"); 
  var terminal = document.getElementById("terminal");
  
  var git = 0;
  var pw = false;
  let pwd = false;
  var commands = [];
  
  setTimeout(function() {
    loopLines(banner, "", 80);
    textarea.focus();
  }, 100);
  
  window.addEventListener("keyup", enterKey);
  
  console.log(
    "%cYou hacked my password!😠",
    "color: #04ff00; font-weight: bold; font-size: 24px;"
  );
  console.log("%cPassword: '" + password + "' - I wonder what it does?🤔", "color: grey");
  
  //init
  textarea.value = "";
  command.innerHTML = textarea.value;
  
  function enterKey(e) {
    if (e.keyCode == 181) {
      document.location.reload(true);
    }
    if (pw) {
      let et = "*";
      let w = textarea.value.length;
      command.innerHTML = et.repeat(w);
      if (textarea.value === password) {
        pwd = true;
      }
      if (pwd && e.keyCode == 13) {
        loopLines(secret, "color2 margin", 120);
        command.innerHTML = "";
        textarea.value = "";
        pwd = false;
        pw = false;
        liner.classList.remove("password");
      } else if (e.keyCode == 13) {
        addLine("Wrong password", "error", 0);
        command.innerHTML = "";
        textarea.value = "";
        pw = false;
        liner.classList.remove("password");
      }
    } else {
      if (e.keyCode == 13) {
        commands.push(command.innerHTML);
        git = commands.length;
        addLine("visitor@fkcodes.com:~$ " + command.innerHTML, "no-animation", 0);
        commander(command.innerHTML.toLowerCase());
        command.innerHTML = "";
        textarea.value = "";
      }
      if (e.keyCode == 38 && git != 0) {
        git -= 1;
        textarea.value = commands[git];
        command.innerHTML = textarea.value;
      }
      if (e.keyCode == 40 && git != commands.length) {
        git += 1;
        if (commands[git] === undefined) {
          textarea.value = "";
        } else {
          textarea.value = commands[git];
        }
        command.innerHTML = textarea.value;
      }
    }
  }
  
  function commander(cmd) {
    switch (cmd.toLowerCase()) {
      case "help":
        loopLines(help, "color2 margin", 80);
        break;
      case "whois":
        loopLines(whois, "color2 margin", 80);
        break;
      case "whoami":
        loopLines(whoami, "color2 margin", 80);
        break;
      case "video":
        addLine("Opening YouTube...", "color2", 80);
        newTab(youtube);
        break;
     
      default:
        addLine("<span class=\"inherit\">Command not found. For a list of commands, type <span class=\"command\">'help'</span>.</span>", "error", 100);
        break;
    }
  }
  
  function newTab(link) {
    setTimeout(function() {
      window.open(link, "_blank");
    }, 500);
  }
  
  function addLine(text, style, time) {
    var t = "";
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
        t += "&nbsp;&nbsp;";
        i++;
      } else {
        t += text.charAt(i);
      }
    }
    setTimeout(function() {
      var next = document.createElement("p");
      next.innerHTML = t;
      next.className = style;
  
      before.parentNode.insertBefore(next, before);
  
      window.scrollTo(0, document.body.offsetHeight);
    }, time);
  }
  
  function loopLines(name, style, time) {
    name.forEach(function(item, index) {
      addLine(item, style, index * time);
    });
  }
  