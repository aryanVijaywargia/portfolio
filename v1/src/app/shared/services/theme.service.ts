import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  private sharedDataSubject = new BehaviorSubject<boolean>(false);
  sharedData$ = this.sharedDataSubject.asObservable();

  setData(data: any) {
    this.sharedDataSubject.next(data);
  }


  get booleanValue$(): Observable<boolean> {
    return this.sharedDataSubject.asObservable();
  }





}
