import { Component } from '@angular/core';
import * as party from 'party-js';
import { IconService } from './icon.service';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  animations: [
    trigger('bannerTrigger', [
      transition(":enter", [
        query("*", [
          style({ opacity: 0, transform: "translateX(-50px)" }),
          stagger(50, [
            animate(
              "250ms cubic-bezier(0.35, 0, 0.25, 1)",
              style({ opacity: 1, transform: "none" })
            )
          ])
        ])
      ])
    ])
  ]
})
export class HeroSectionComponent {

  heroHeading: string = "<p>I'm <strong>Aryan Vijaywargia</strong>, a Fullstack developer.</p>"
  heroPre: string = "Welcome to my site."
  iconNames: string[] = ['cib-angular', 'cib-tensorflow', 'cib-typescript', 'cib-flask'];

  heroCtai: string = "google";

  constructor(public iconService: IconService) { }

  ngOnInit(): void {
    this.iconService.loadIcons(this.iconNames)
      .then(() => {
        console.log("Icons have been loaded and are ready to be displayed")
      })
      .catch(error => {
        console.error('Failed to load icons:', error);
      });
  }


  tech = [
    {
      name: 'Typescript',
      Icon: 'Typescript',
    },
    {
      name: 'Angular',
      Icon: 'Angular',
    },
    {
      name: 'Dotnet',
      Icon: 'Dotnet',
    },
    {
      name: 'Tensorflow',
      Icon: 'Tensorflow',
    },
    {
      name: 'Python',
      Icon: 'Python',
    },
  ] as const;

  onWowClick(event: Event) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('before:absolute');
    party.confetti(target, { count: 40 });
  }

}
