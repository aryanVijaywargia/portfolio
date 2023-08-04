import { Component } from '@angular/core';
// import { SiNodeDotJs } from '@angular-icons/all-files/si/SiNodeDotJs';
// import { SiReact } from '@angular-icons/all-files/si/SiReact';
// import { SiShopify } from '@angular-icons/all-files/si/SiShopify';
// import { SiTailwindcss } from '@angular-icons/all-files/si/SiTailwindcss';
// import { TECH } from 'content/tech-stack';
import * as party from 'party-js';
import { IconService } from '../hero-section/icon.service';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {

  iconNames: string[] = ['cib-angular', 'cib-tensorflow', 'cib-typescript', 'cib-dot-net'];  

  constructor(public iconService: IconService) {}

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
      name: 'Angular',
      Icon: 'cib-angular',
    },
    {
      name: 'Node.js',
      Icon: 'cib-tensorflow',
    },
    {
      name: 'Tailwind',
      Icon: 'cib-typescript',
    },
    {
      name: 'Shopify',
      Icon: 'cib-dot-net',
    },
  ] as const;

  // iconInjector = Injector.create({
  //   providers: [{ provide: 'className', useValue: 'your-class-name' }],
  // });

  onWowClick(event: Event) {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('before:absolute');
    party.confetti(target, { count: 40 });
  }

}
