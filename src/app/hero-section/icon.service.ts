// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class IconService {
//   private iconCache: { [key: string]: string } = {};


//   // let iconss = `../../assets/icons/svg/brand/cib-tensorflow.svg`

//   loadIcons(iconNames: string[]): Promise<void[]> {
//     const iconPromises: Promise<void>[] = [];

//     for (const iconName of iconNames) {
//       if (!this.iconCache[iconName]) {
//         const iconPromise = this.loadIcon(iconName);
//         iconPromises.push(iconPromise);
//       }
//     }

//     return Promise.all(iconPromises);
//   }

//   getIcon(iconName: string): string {
//     return this.iconCache[iconName];
//   }

//   public loadIcon(iconName: string): Promise<void> {
//     return new Promise<void>((resolve, reject) => {
//       // Assuming you have stored your individual SVG icon files in the `assets/icons` directory
//       const iconPath = `../../assets/icons/svg/brand/${iconName}.svg`;
//       console.log("The icon path is " + iconPath)
//       const xhr = new XMLHttpRequest();
//       xhr.open('GET', iconPath, true);
//       xhr.onload = () => {
//         if (xhr.status === 200) {
//           this.iconCache[iconName] = xhr.responseText;
//           resolve();
//         } else {
//           reject(`Failed to load icon '${iconName}'.`);
//         }
//       };
//       xhr.onerror = () => {
//         // reject(`Failed to load icon '${iconName}'.`);
//         console.log('XHR Error:', xhr.statusText);
//         reject(`Failed to load icon '${iconName}'.`);
//       };
//       xhr.send();
//     });
//   }
// }






import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private iconCache: { [key: string]: SafeHtml } = {};

  constructor(private sanitizer: DomSanitizer) {}

  loadIcons(iconNames: string[]): Promise<void[]> {
    const iconPromises: Promise<void>[] = [];

    for (const iconName of iconNames) {
      if (!this.iconCache[iconName]) {
        const iconPromise = this.loadIcon(iconName);
        iconPromises.push(iconPromise);
      }
    }

    return Promise.all(iconPromises);
  }

  getIcon(iconName: string): SafeHtml {
    return this.iconCache[iconName];
  }

  private loadIcon(iconName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const iconPath = `../../assets/icons/svg/brand/${iconName}.svg`;

      const xhr = new XMLHttpRequest();
      xhr.open('GET', iconPath, true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          const sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(xhr.responseText);
          this.iconCache[iconName] = sanitizedContent;
          resolve();
        } else {
          reject(`Failed to load icon '${iconName}'.`);
        }
      };
      xhr.onerror = () => {
        reject(`Failed to load icon '${iconName}'.`);
      };
      xhr.send();
    });
  }
}
