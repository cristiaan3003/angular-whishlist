import { DestinoViaje } from './destino-viaje.model';
import { Subject, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.module';

export class DestinosApiClient {
	destinos:DestinoViaje[];
	//current: Subject<DestinoViaje> = new BehaviorSubject<DestinoViaje>(null);

	constructor() {
       this.destinos = [];
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
	  this.destinos.push(d);
	}
	getAll():DestinoViaje[]{
	  return this.destinos;
    }
	getById(id:String):DestinoViaje{
	  return this.destinos.filter(function(d){return d.id.toString() == id;})[0];
    }
    elegir(d:DestinoViaje){
	    this.destinos.forEach(x => x.setSelected(false));
	    d.setSelected(true);
	    //this.current.next(d);
    }
}