import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotToggleService {

  constructor() { }

  private commandSource = new Subject<boolean>();

  command$ = this.commandSource.asObservable();

  sendCommand(command: boolean) {
    this.commandSource.next(command);
  }

}
