import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { fromEvent, pipe } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { map,filter,debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})
export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  fg: FormGroup;
  minLongitud = 3;
  searchResults: string[];
  constructor(fb: FormBuilder) { 
    this.onItemAdded = new EventEmitter();
    this.fg = fb.group({
      nombre: ['', Validators.compose([
        Validators.required,
        this.nombreValidatorParametrizable(this.minLongitud)
      ])],
      url: ['']
    });
    this.fg.valueChanges.subscribe((form: any)=>{
      console.log('cambios en el formuladio', form);
    });
  }

  ngOnInit() {
    let elemNombre = <HTMLInputElement> document.getElementById('nombre');
    fromEvent(elemNombre,'input')// (obserable de eventos)listener de las teclas que presiona el usuario
    .pipe(
      map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
      filter(text => text.length > 2), //largo minimo del texto
      debounceTime(200),// delay de tecleado
      distinctUntilChanged(),// si hubo cambios en lo que llega del teclado
      switchMap(() => ajax('/assets/datos.json')) //este texto a buscar se lo pasamos a un API de busqueda

    ).subscribe(AjaxResponse => {
      console.log(AjaxResponse)
      console.log(AjaxResponse.response)
      this.searchResults = AjaxResponse.response;
    })
  }
  
  guardar(nombre: string, url: string):boolean{
    let d = new DestinoViaje(nombre,url);
    this.onItemAdded.emit(d);
    return false;
  }

  nombreValidator(control : FormControl):{[s: string]: boolean}{
    let l = control.value.toString().trim().length;
    if(l>0 && l<5){
      return {invalidNombre: true};
    }
    return null;
  }
  nombreValidatorParametrizable(minLong: number): ValidatorFn{
    return(control: FormControl):{[s: string]:boolean}| null =>{
      let l = control.value.toString().trim().length;
      if(l>0 && l<minLong){
        return {minLongNombre: true};
      }
      return null;
    }
  }

}
