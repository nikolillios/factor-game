import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameboardComponent } from './gameboard/gameboard.component';
import { ScorecardComponent } from './scorecard/scorecard.component';

@NgModule({
  declarations: [
    AppComponent,
    GameboardComponent,
    ScorecardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
