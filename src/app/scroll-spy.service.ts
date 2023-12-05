// scroll-spy.service.ts
import { Injectable, ElementRef, Renderer2, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollSpyService {
  private scrollPositions: { [key: string]: number } = {};
  scrollPositionChanged = new EventEmitter<{ componentName: string; position: number }>();

  setScrollPosition(componentName: string, position: number): void {
    this.scrollPositions[componentName] = position;
    this.scrollPositionChanged.emit({ componentName, position });
  }

  getScrollPosition(componentName: string): number {
    return this.scrollPositions[componentName] || 0;
  }
}

