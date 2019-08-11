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
import Dexie from 'dexie';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {TranslateService, TranslateLoader, TranslateModule} from '@ngx-translate/core';


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
import { DestinoViaje } from './models/destino-viaje.model';
import { Observable, from } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EspiameDirective } from './espiame.directive';
import { TrackearClickDirective } from './trackear-click.directive';


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


// dexie db
export class Translation {
  constructor(public id: number, public lang: string, public key: string, public value: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class MyDatabase extends Dexie {
  destinos: Dexie.Table<DestinoViaje, number>;
  translations: Dexie.Table<Translation, number>;
  constructor () {
      super('MyDatabase');
      this.version(1).stores({
        destinos: '++id, nombre, imagenUrl',
      });
      this.version(2).stores({
        destinos: '++id, nombre, imagenUrl',
        translations: '++id, lang, key, value'
      });

  }
}

export const db = new MyDatabase(); //exportamos intancia de conexion a la base de datos
// fin dexie db


// i18n ini
class TranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string): Observable<any> {
    const promise = db.translations
                      .where('lang')
                      .equals(lang)
                      .toArray()
                      .then(results => {
                                        if (results.length === 0) {
                                          return this.http
                                            .get<Translation[]>(APP_CONFIG_VALUE.apiEndpoint + '/api/translation?lang=' + lang)
                                            .toPromise()
                                            .then(apiResults => {
                                              db.translations.bulkAdd(apiResults);
                                              return apiResults;
                                            });
                                        }
                                        return results;
                                      }).then((traducciones) => {
                                        console.log('traducciones cargadas:');
                                        console.log(traducciones);
                                        return traducciones;
                                      }).then((traducciones) => {
                                        return traducciones.map((t) => ({ [t.key]: t.value}));
                                      });
    /*
    return from(promise).pipe(
      map((traducciones) => traducciones.map((t) => { [t.key]: t.value}))
    );
    */
   return from(promise).pipe(flatMap((elems) => from(elems)));
  }
}

function HttpLoaderFactory(http: HttpClient) {
  return new TranslationLoader(http);
}
// fin i18n



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
    VuelosDetalleComponent,
    EspiameDirective,
    TrackearClickDirective
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
    ReservasModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (HttpLoaderFactory),
          deps: [HttpClient]
      }
  }),
  NgxMapboxGLModule,
  BrowserAnimationsModule 
  ],
  providers: [
    UsuarioLogueadoGuard,
    AuthService,
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE }, //inyecion de dependencias config app
    AppLoadService,       //inyecion de dependencias inicio app
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true }, //inyecion de dependencias inicio app
    MyDatabase
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
