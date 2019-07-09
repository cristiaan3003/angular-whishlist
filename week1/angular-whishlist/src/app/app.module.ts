import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router'
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';
import { DestinosApiClient } from './models/destinos-api-client.model';
import { DestinosViajesState, reducerDestinosViajes,initializeDestinosViajesState, DestinosViajesEffects } from './models/destino-viajes-states.models';
import { ActionReducerMap, StoreModule as NgrxStoreModule } from '@ngrx/store';
import { EffectsModule} from '@ngrx/effects';
import { environment } from 'src/environments/environment';



const routes: Routes =[
  {path: '',redirectTo: 'home',pathMatch: 'full'},
  {path: 'home',component: ListaDestinosComponent},
  {path: 'destino',component: DestinoDetalleComponent}
];

//redux init

//estado global de la App
export interface AppState{
  destinos: DestinosViajesState;

}

//reducer globales de la App
const reducers: ActionReducerMap<AppState> ={
  destinos: reducerDestinosViajes
}

//estado inicial
let reducersInitialState = {
  destinos: initializeDestinosViajesState()
}

//redux fin init

@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    NgrxStoreModule.forRoot(reducers,{initialState: reducersInitialState}),
    EffectsModule.forRoot([DestinosViajesEffects]),
    // Note that you must instrument after importing StoreModule
    StoreDevtoolsModule.instrument({
      //maxAge: 25, // ultimo XX cambios de estados 
      //logOnly: environment.production,
    })
  ],
  providers: [
    DestinosApiClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
