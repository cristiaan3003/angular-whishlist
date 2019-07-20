import { DestinoViaje } from './destino-viaje.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.module';
import { NuevoDestinoAction, ElegidoFavoritoAction } from './destino-viajes-states.models';
import { Injectable } from '@angular/core';

@Injectable()
export class DestinosApiClient {
  
	//destinos:DestinoViaje[];
	//current: Subject<DestinoViaje> = new BehaviorSubject<DestinoViaje>(null);

	constructor(private store: Store<AppState>) {
	}
	/*constructor(private store: Store<AppState>) {
		this.store
		  .select(state => state.destinos)
		  .subscribe((data) => {
			console.log('destinos sub store');
			console.log(data);
			this.destinos = data.items;
		  });
		this.store
		  .subscribe((data) => {
			console.log('all store');
			console.log(data);
		  });
	  }*/

	add(d:DestinoViaje){
	  this.store.dispatch(new NuevoDestinoAction(d));
	}
    elegir(d:DestinoViaje){
	    this.store.dispatch(new ElegidoFavoritoAction(d));
	}

}