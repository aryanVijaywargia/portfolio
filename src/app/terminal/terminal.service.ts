import { Injectable, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

    constructor(private sanitized: DomSanitizer) {}

  getHtmlComponent(inputText: string): any {
    if (inputText === 'button') {
      return this.sanitized.bypassSecurityTrustHtml(
        "<p class=\"has-text-weight-bold\"> Hello! I'm Ashleigh </p>"
    );
    } else if (inputText === 'image') {
      return this.sanitized.bypassSecurityTrustHtml('<img src="https://example.com/image.jpg">');
    } else {
      return '';
    }
  }
}