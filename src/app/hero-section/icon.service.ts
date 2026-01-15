













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
