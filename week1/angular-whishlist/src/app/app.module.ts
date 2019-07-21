import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, Injectable, APP_INITIALIZER } from '@angular/core';
import {RouterModule,Routes} from '@angular/router'
import {FormsModule,ReactiveFormsModule} from '@angular/forms'
import { StoreDevtoolsModule } from '@ngrx/store-devtools';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';

import { DestinosViajesState, reducerDestinosViajes,initializeDestinosViajesState, DestinosViajesEffects, InitMyDataAction } from './models/destino-viajes-states.models';
import { ActionReducerMap, StoreModule as NgrxStoreModule, Store } from '@ngrx/store';
import { EffectsModule} from '@ngrx/effects';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { AuthService } from './services/auth.service';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';
import { VuelosComponent } from './components/vuelos/vuelos/vuelos.component';
import { VuelosMainComponent } from './components/vuelos/vuelos-main/vuelos-main.component';
import { VuelosMasInfoComponent } from './components/vuelos/vuelos-mas-info/vuelos-mas-info.component';
import { VuelosDetalleComponent } from './components/vuelos/vuelos-detalle/vuelos-detalle.component';
import { ReservasModule } from './reservas/reservas.module';
import { HttpClientModule, HttpHeaders, HttpRequest, HttpClient } from '@angular/common/http';


// app config -- inyecion de dependencias de variables de configuracion
export interface AppConfig {
  apiEndpoint: String;
}
const APP_CONFIG_VALUE: AppConfig = {
  apiEndpoint: 'http://localhost:3000'
};
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
// fin app config


// init routing
export const childrenRoutesVuelos: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: VuelosMainComponent },
  { path: 'mas-info', component: VuelosMasInfoComponent },
  { path: ':id', component: VuelosDetalleComponent },
];
const routes: Routes =[
  {path: '',redirectTo: 'home',pathMatch: 'full'},
  {path: 'home',component: ListaDestinosComponent},
  {path: 'destino/:id',component: DestinoDetalleComponent},
  {path: 'login', component: LoginComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [ UsuarioLogueadoGuard ]
  },
  {
    path: 'vuelos',
    component: VuelosComponent,
    canActivate: [ UsuarioLogueadoGuard ],
    children: childrenRoutesVuelos
  }
];
//end routing


// app init
export function init_app(appLoadService: AppLoadService): () => Promise<any>  {
  return () => appLoadService.intializeDestinosViajesState();
}

@Injectable()
class AppLoadService {
  constructor(private store: Store<AppState>, private http: HttpClient) { }
  async intializeDestinosViajesState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: headers });
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}

// fin app init




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
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
    VuelosComponent,
    VuelosMainComponent,
    VuelosMasInfoComponent,
    VuelosDetalleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    NgrxStoreModule.forRoot(reducers,{initialState: reducersInitialState}),
    EffectsModule.forRoot([DestinosViajesEffects]),
    // Note that you must instrument after importing StoreModule
    StoreDevtoolsModule.instrument({
      //maxAge: 25, // ultimo XX cambios de estados 
      //logOnly: environment.production,
    }),
    ReservasModule
  ],
  providers: [
    UsuarioLogueadoGuard,
    AuthService,
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE }, //inyecion de dependencias config app
    AppLoadService,       //inyecion de dependencias inicio app
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true } //inyecion de dependencias inicio app
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
