import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialAccounts = [
    {
      name: "GitHub",
    },
    {
      name: "LinkedIn",
    },
    {
      name: "Twitter",
    },
    {
      name: "Mail",
    }
  ];
}
