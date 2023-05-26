import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InputTargetService {
  targetInputedList: string[] = [];
  targetInputed: Subject<string> = new Subject<string>();

  public inputTarget(targetInputed: string): void {
    this.targetInputedList.push(targetInputed);
    this.targetInputed.next(targetInputed);
  }
}