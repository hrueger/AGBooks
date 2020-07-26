import { Injectable, Output, EventEmitter } from "@angular/core";
@Injectable()
export class NavbarService {
    public resetHighestStepHandover(): void {
        this._highestStep = 1;
        sessionStorage.setItem("highestStep", "1");
    }

    constructor() {
        const step = sessionStorage.getItem("highestStep");
        if (step) {
            this.setStep(parseInt(step, 10));
        }
    }
    stepNummber = 0;

    _highestStep = 0;

    @Output() change: EventEmitter<number> = new EventEmitter();

    public setStep(step: number): void {
        this.stepNummber = step;
        if (step > this._highestStep) {
            this._highestStep = step;
            sessionStorage.setItem("highestStep", step.toString());
        }
        this.change.emit(this.stepNummber);
    }

    public get currentStep(): number {
        return this.stepNummber;
    }
    public get highestStep(): number {
        return this._highestStep;
    }
}
