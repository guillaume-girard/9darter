import { InputOutputPropertySet } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { InputTargetService } from 'src/app/services/input-target.service';

@Component({
  selector: 'app-input-target',
  templateUrl: './input-target.component.html',
  styleUrls: ['./input-target.component.scss']
})
export class InputTargetComponent implements OnInit {
  validTargetValues: string[] = [];
  targetValue: string = '';
  enableNextPlayerButton = true;

  constructor(private inputTargetService: InputTargetService) { }
  
  ngOnInit(): void {
    this.inputTargetService.enableNextPlayerButton.subscribe((value) => this.enableNextPlayerButton = value);
  }

  onSubmitTarget(): void {
    try {
      this.inputTargetService.inputTarget(this.targetValue);
      this.targetValue = '';
    } catch (error) {
      console.error(error);
    }
  }
  
  onNextPlayer(): void {
    this.inputTargetService.emitNextPlayer();
  }
}
