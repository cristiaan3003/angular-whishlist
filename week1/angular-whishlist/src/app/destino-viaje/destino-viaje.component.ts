import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {
  @Input() nombre: string; //nombre puede ser pasado como parametro a las plantillas del componente
  constructor() {
  }

  ngOnInit() {
  }

}
