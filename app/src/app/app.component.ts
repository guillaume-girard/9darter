import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  targetValues: string[] = [];

  targetValueInput(targetValue: string): void {
    this.targetValues.push(targetValue);
  }
}
