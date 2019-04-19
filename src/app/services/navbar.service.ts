import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class NavbarService {

  stepNummber: number = 0;

  @Output() change: EventEmitter<number> = new EventEmitter();

  setStep(step) {
    this.stepNummber = step;
    this.change.emit(this.stepNummber);
  }

}