import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }
  // private sharedData: any;

  private sharedDataSubject = new BehaviorSubject<boolean>(false);
  sharedData$ = this.sharedDataSubject.asObservable();

  setData(data: any) {
    this.sharedDataSubject.next(data);
  }

  // private booleanValueSubject = new BehaviorSubject<boolean>(false);

  get booleanValue$(): Observable<boolean> {
    return this.sharedDataSubject.asObservable();
  }



  // setData(data: any) {
  //   this.sharedData = data;
  // }

  // getData() {
  //   return this.sharedData;
  // }

}
