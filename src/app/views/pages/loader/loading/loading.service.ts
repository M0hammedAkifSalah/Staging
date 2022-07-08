import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  showLoader = new BehaviorSubject<boolean>(false);

  constructor() { }

  show() {
    this.showLoader.next(true);
  }

  hide() {
    setTimeout(() => {
      this.showLoader.next(false);
    }, 1000);
  }

}
