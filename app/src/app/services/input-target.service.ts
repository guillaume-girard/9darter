import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InputTargetService {
  validTargetValues: string[] = [];
  targetInputedList: string[] = [];
  targetInputed: Subject<string> = new Subject<string>();
  nextPlayer: Subject<boolean> = new Subject<boolean>();
  cancel: Subject<boolean> = new Subject<boolean>();
  enableNextPlayerButton: Subject<boolean> = new Subject<boolean>();
  timeoutObject: any = null;

  constructor() {
    for (let i = 1; i <= 20; i++) {
      for (let prefix of ['', 'd', 't']) {
        this.validTargetValues.push(prefix + i);
      }
    }
    this.validTargetValues.push('0', '25', '50', 'b', 'db', 'n', 'c');
  }
  
  public inputTarget(targetInputed: string): void {
    if (this.validTargetValues.includes(targetInputed)) {
      this.targetInputedList.push(targetInputed);
      if (targetInputed === "c") {
        this.emitCancel();
      } else if (targetInputed === "n") {
        this.emitNextPlayer();
      } else {
        this.targetInputed.next(targetInputed);
      }
    } else {
      throw new Error('Invalid target inputed');
    }
  }
  
  public emitNextPlayer(): void {
    this.nextPlayer.next(true);
  }
  
  public emitCancel(): void {
    this.cancel.next(true);
  }

  public temporaryDisableNextPlayerButton() {
    this.enableNextPlayerButton.next(false);

    clearTimeout(this.timeoutObject);

    this.timeoutObject = setTimeout(() => {
      this.enableNextPlayerButton.next(true);
    }, 2500);
  }
}