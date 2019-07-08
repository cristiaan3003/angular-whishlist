import { Component, OnInit, Input, HostBinding, EventEmitter, Output } from '@angular/core';
import {DestinoViaje} from '../models/destino-viaje.model'
import { AppState } from '../app.module';
import { Store } from '@ngrx/store';
import { VoteDownAction, VoteUpAction } from '../models/destino-viajes-states.models';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {
  @Input() destino: DestinoViaje; //nombre puede ser pasado como parametro a las plantillas del componente
  @Input('idx') position: number; //renombro la variable a nivel "template"-> osea en el template se llamara 'idx'
  @HostBinding('attr.class') cssClass='col-md-4';
  @Output() clicked: EventEmitter<DestinoViaje>;
  constructor(private store: Store<AppState>) {
    this.clicked = new EventEmitter();
  }

  ngOnInit() {
  }

  ir(){
    this.clicked.emit(this.destino);
    return false;
  }

  voteUp() {
    this.store.dispatch(new VoteUpAction(this.destino));
    return false;
  }
  voteDown(){
    this.store.dispatch(new VoteDownAction(this.destino));
    return false;
  }


}
