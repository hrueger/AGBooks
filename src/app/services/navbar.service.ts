import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class NavbarService {
  resetHighestStepHandover() {
    this._highestStep = 1;
    sessionStorage.setItem("highestStep", "1");
  }

  constructor() {
    var step = sessionStorage.getItem("highestStep");
    if (step) {
      this.setStep(step);

    }
  }
  stepNummber: number = 0;

  _highestStep: number = 0;

  @Output() change: EventEmitter<number> = new EventEmitter();

  setStep(step) {
    this.stepNummber = step;
    if (step > this._highestStep) {
      this._highestStep = step;
      sessionStorage.setItem("highestStep", step);
    }
    this.change.emit(this.stepNummber);
  }

  get currentStep() {
    return this.stepNummber;
  }
  get highestStep() {
    return this._highestStep;
  }

}