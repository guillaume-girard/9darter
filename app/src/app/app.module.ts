import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputTargetComponent } from './components/input-target/input-target.component';
import { FormsModule } from '@angular/forms';
import { PlayerListItemComponent } from './components/player-list-item/player-list-item.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { GameX01Component } from './components/gameX01/gameX01.component';
import { PlayerService } from './services/players.service';
import { InputTargetService } from './services/input-target.service';

@NgModule({
  declarations: [
    AppComponent,
    InputTargetComponent,
    PlayerListItemComponent,
    PlayerListComponent,
    GameX01Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    PlayerService,
    InputTargetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
