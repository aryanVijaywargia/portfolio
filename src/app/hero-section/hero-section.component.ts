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
  heroPre:string = "Welcome to my site."
  // heroBody:string = "<p> I love writing code that takes things next level, creating highly performant websites, automated API integrations, building my own dev-tools, and creating stunning user-experiences that make you feel<em class='relative cursor-pointer before:absolute b:bottom-0 b:-z-10 b:h-3 b:w-full b:-rotate-2 b:animate-hint-hint b:bg-pink-400/70 b:blur-sm d:b:bg-pink-600' (click)='onWowClick($event)'> WOW!</em></p>"
  iconNames: string[] = ['cib-angular', 'cib-tensorflow', 'cib-typescript', 'cib-flask'];  

  heroCtai:string = "google";

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





// @ts-ignore
// import { SiNodeDotJs } from "@react-icons/all-files/si/SiNodeDotJs";
// import { SiReact } from "@react-icons/all-files/si/SiReact";
// import { SiShopify } from "@react-icons/all-files/si/SiShopify";
// import { SiTailwindcss } from "@react-icons/all-files/si/SiTailwindcss";
// import { TECH } from "content/tech-stack";
// import party from "party-js";

// export const HERO = {
//   pre: "Welcome to my site.",
//   heading: (
//     <>
//       I'm <strong>Felix Tellmann</strong>, a Fullstack developer.
//     </>
//   ),
//   tech: [
//     TECH.nextjs,
//     {
//       name: "Node.js",
//       Icon: ({ className }) => <SiNodeDotJs className={className} />,
//     },
//     {
//       name: "Tailwind",
//       Icon: ({ className }) => <SiTailwindcss className={className} />,
//     },
//     {
//       name: "Shopify",
//       Icon: ({ className }) => <SiShopify className={className} />,
//     },
//   ] as const,
  // body: (
  //   <>
  //     I love writing code that takes things next level creating highly performant websites,
  //     automated API integrations, building my own dev-tools, and creating stunning user-experiences
  //     that makes you feel{" "}
  //     <em
  //       className="relative cursor-pointer before:absolute b:bottom-0 b:-z-10 b:h-3 b:w-full b:-rotate-2 b:animate-hint-hint b:bg-pink-400/70 b:blur-sm d:b:bg-pink-600"
  //       onClick={(e) => {
  //         e.currentTarget.classList.remove("before:absolute");
  //         party.confetti(e.currentTarget, { count: 40 });
  //       }}
  //     >
  //       WOW!
  //     </em>
  //     .<span className="mt-4 block" />I am always keen to learn and explore new technologies,
  //     frameworks and programming languages. Currently, I'm learning about{" "}
  //     .
  //   </>
  // ),
  
// };
