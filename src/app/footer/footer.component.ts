import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'] // or .css if you're using plain CSS
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialAccounts = [
    {
      name: "GitHub",
      href: "https://github.com/FelixTellmann",
      iconPath: "path_to_github_icon" // Replace with the path to your icon or SVG
    },
    {
      name: "Twitter",
      href: "https://twitter.com/FelixTellmann",
      iconPath: "path_to_twitter_icon" 
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/felix.tellmann/",
      iconPath: "path_to_facebook_icon" 
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/felixtellmann",
      iconPath: "path_to_linkedin_icon" 
    }
  ];
}
