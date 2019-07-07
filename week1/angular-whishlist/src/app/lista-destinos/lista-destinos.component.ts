import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import {DestinoViaje} from '../models/destino-viaje.model'
import {DestinosApiClient} from '../models/destinos-api-client.model';

@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css']
})
export class ListaDestinosComponent implements OnInit {
  //destinos: DestinoViaje[];
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  constructor(private destinosApiClient:DestinosApiClient) {
    this.onItemAdded = new EventEmitter();
  }

  ngOnInit() {
  }
  agregado(d:DestinoViaje){
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
  }
  elegido(d: DestinoViaje){
    this.destinosApiClient.getAll().forEach(x => x.setSelected(false));
    d.setSelected(true);
  }

}
