import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ThemeService } from '../theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hamburger-icon',
  templateUrl: './hamburger-icon.component.html',
  styleUrls: ['./hamburger-icon.component.scss']
})
export class HamburgerIconComponent {
  receivedTheme!: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2, private themeService: ThemeService) { }
  McButton!:any;
  private subscription!:Subscription
  
  ngOnInit() {

    this.McButton = this.el.nativeElement.querySelector('[data=hamburger-menu]');
    const McBars = this.el.nativeElement.querySelectorAll('.McButton b');

    this.McButton.addEventListener('click', () => {
      this.McButton.classList.toggle('active');

      if (this.McButton.classList.contains('active')) {
        this.animateBars(true);
      } else {
        this.animateBars(false);
      }
    });
  }

  private animateBars(open: boolean): void {
    const McBars = this.el.nativeElement.querySelectorAll('.McButton b');
    const [McBar1, McBar2, McBar3] = McBars;

    if (open) {
      this.renderer.setStyle(McBar1, 'top', '50%');
      this.renderer.setStyle(McBar3, 'top', '50%');
      this.renderer.setStyle(McBar3, 'transform', 'rotateZ(90deg)');
      this.renderer.setStyle(this.McButton, 'transform', 'rotateZ(135deg)');
    } else {
      this.renderer.removeStyle(McBar1, 'top');
      this.renderer.removeStyle(McBar3, 'top');
      this.renderer.removeStyle(McBar3, 'transform');
      this.renderer.removeStyle(this.McButton, 'transform');
    }
  }

}
