import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-propagador',
  templateUrl: './propagador.component.html',
  styleUrls: ['./propagador.component.css']
})
export class PropagadorComponent implements OnInit {
  mensaje: string;

  @Output()
  propagar = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onPropagar() {
    this.propagar.emit(this.mensaje);//emito evento hacia arriba, hacia el componente padre
    return false;
  }


}
