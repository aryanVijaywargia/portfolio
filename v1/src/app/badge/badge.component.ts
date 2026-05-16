import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `
    <span
      [class]="computeClasses()"
    >
      {{ children | titlecase }}
    </span>
  `,
  styles: []
})
export class BadgeComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() style: 'plain' | 'info' | 'success' | 'attention' | 'warning' | 'critical' | 'disabled' | 'accent' = 'plain';
  @Input() children: string="Test badge";

  computeClasses(): string {
    let classes = 'inline-flex select-none items-center whitespace-nowrap rounded-md border-2 font-medium transition-all';

    if (this.size === 'sm') {
      classes += ' px-1.5 py-0.5 text-xs';
    } else if (this.size === 'md') {
      classes += ' px-2.5 py-0.5 text-[13px]';
    } else if (this.size === 'lg') {
      classes += ' px-3 py-1 text-[13px]';
    }

    if (this.style === 'disabled') {
      classes += ' cursor-not-allowed border-gray-700/5 bg-gray-100 text-gray-400';
    } else if (this.style === 'info') {
      classes += ' cursor-pointer border-cyan-700/20 bg-cyan-100 text-cyan-900 hfa:bg-cyan-200/90 d:border-cyan-400/30 d:bg-gradient-to-b d:from-cyan-900/90 d:to-cyan-900/90 d:text-cyan-100 d:hfa:from-cyan-900/70 d:hfa:to-cyan-900/70';
    } else if (this.style === 'warning'){
      classes += ' cursor-pointer border-orange-700/20 bg-orange-100 text-orange-900 hfa:bg-orange-200/90 d:border-orange-400/30 d:bg-gradient-to-b d:from-orange-900/90 d:to-orange-900/90 d:text-orange-100 d:hfa:from-orange-900/70 d:hfa:to-orange-900/70';
    } else if(this.style==="attention"){
       classes += ' cursor-pointer border-yellow-700/20 bg-yellow-100 text-yellow-900 hfa:bg-yellow-200/90 d:border-yellow-400/30 d:bg-gradient-to-b d:from-yellow-900/90 d:to-yellow-900/90 d:text-yellow-100 d:hfa:from-yellow-900/70 d:hfa:to-yellow-900/70';
    } else if(this.style==="success"){
      classes += ' cursor-pointer border-green-700/20 bg-green-100 text-green-900 hfa:bg-green-200/90 d:border-green-400/30 d:bg-gradient-to-b d:from-green-900/90 d:to-green-900/90 d:text-green-100 d:hfa:from-green-900/70 d:hfa:to-green-900/70';
    } else if(this.style==="accent"){
      classes += ' cursor-pointer border-pink-700/20 bg-pink-100 text-pink-900 hfa:bg-pink-200/90 d:border-pink-400/30 d:bg-gradient-to-b d:from-pink-900/90 d:to-pink-900/90 d:text-pink-100 d:hfa:from-pink-900/70 d:hfa:to-pink-900/70';
    }

    return classes;
  }
}
