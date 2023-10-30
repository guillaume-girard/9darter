import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'app-game-selector',
  templateUrl: './game-selector.component.html',
  styleUrls: ['./game-selector.component.scss']
})
export class GameSelectorComponent {
  @Output() launchGame = new EventEmitter<string>();
  @Input() canLaunchGame: boolean = false;
  mainForm: FormGroup;
  gameMode: FormControl;
  isDoubleOut: FormControl;
  isReverseCricket: FormControl;
  isCrazyCricket: FormControl;
  nbLegsToWin: FormControl;

  showOptionsCtrl$: Observable<boolean>;
  show301OptionsCtrl: boolean = false;
  show501OptionsCtrl: boolean = false;
  showCricketOptionsCtrl: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.gameMode = this.formBuilder.control('', Validators.required);
    this.isDoubleOut = this.formBuilder.control(false);
    this.isReverseCricket = this.formBuilder.control(false);
    this.isCrazyCricket = this.formBuilder.control(false);
    this.nbLegsToWin = this.formBuilder.control(1);

    this.showOptionsCtrl$ = this.gameMode.valueChanges.pipe(
      tap(value => {
        switch(value) {
          case '301': 
            this.show301OptionsCtrl = true;
            this.show501OptionsCtrl = false;
            this.showCricketOptionsCtrl = false;
            return;
          case '501': 
            this.show301OptionsCtrl = false;
            this.show501OptionsCtrl = true;
            this.showCricketOptionsCtrl = false;
          return;
          case 'cricket': 
            this.show301OptionsCtrl = false;
            this.show501OptionsCtrl = false;
            this.showCricketOptionsCtrl = true;
          return;
          default: 
            this.show301OptionsCtrl = false;
            this.show501OptionsCtrl = false;
            this.showCricketOptionsCtrl = false;
            return;
        }
      }),
      map(value => true));

    this.mainForm = this.formBuilder.group({
      gameMode: this.gameMode,
      isDoubleOut: this.isDoubleOut,
      isReverseCricket: this.isReverseCricket,
      isCrazyCricket: this.isCrazyCricket,
      nbLegsToWin: this.nbLegsToWin
    });
  }

  onSubmitGameForm() {
    this.launchGame.emit(this.mainForm.value);
  }
}
