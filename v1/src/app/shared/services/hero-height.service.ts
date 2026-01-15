import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroHeightService {

  private heroHeightSubject = new BehaviorSubject<number>(0);
  public heroHeight$ = this.heroHeightSubject.asObservable();

  setHeroHeight(height: number) {
    this.heroHeightSubject.next(height);
  }

}
