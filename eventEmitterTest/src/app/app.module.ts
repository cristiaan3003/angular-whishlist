import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PropagadorComponent } from './components/propagador/propagador.component';
import { PadreComponent } from './components/padre/padre.component';

@NgModule({
  declarations: [
    AppComponent,
    PropagadorComponent,
    PadreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
