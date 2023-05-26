import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-input-target',
  templateUrl: './input-target.component.html',
  styleUrls: ['./input-target.component.scss']
})
export class InputTargetComponent implements OnInit {
  validTargetValues: string[] = [];
  targetValue: string = '';
  @Output() targetValueInputed = new EventEmitter<string>();

  constructor() {
    for (let i = 1; i<=20; i++) {
      for (let prefix of ['', 'd', 't']) {
        this.validTargetValues.push(prefix + i);
      }
    }
    this.validTargetValues.push('b', 'db');
  }
  
  ngOnInit(): void {}

  onSubmitTarget(): void {
    if (this.validTargetValues.includes(this.targetValue)) {
      this.targetValueInputed.emit(this.targetValue);
    } else {
      console.error('Invalid target value: ' + this.targetValue);
    }
    this.targetValue = '';
  }
}
