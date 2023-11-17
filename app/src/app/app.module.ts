// Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// App modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// App components
import { InputTargetComponent } from './components/input-target/input-target.component';
import { PlayersSelectorComponent } from './components/players-selector/players-selector.component';
import { GameX01Component } from './components/gameX01/gameX01.component';
import { GameSelectorComponent } from './components/game-selector/game-selector.component';
import { GameCricketComponent } from './components/game-cricket/game-cricket.component';

// App services
import { PlayerService } from './services/players.service';
import { InputTargetService } from './services/input-target.service';

// primeng modules
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { ConfirmPopupModule } from 'primeng/confirmpopup';


@NgModule({
  declarations: [
    AppComponent,
    InputTargetComponent,
    PlayersSelectorComponent,
    GameX01Component,
    GameSelectorComponent,
    GameCricketComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    PickListModule,
    ConfirmPopupModule
  ],
  providers: [
    PlayerService,
    InputTargetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
