import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress', null) textProgress: ElementRef;

  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
    // console.log(this.leyenda, this.progreso);
  }

  ngOnInit() {
    // console.log(this.leyenda, this.progreso);
  }

  cambiarValor( valor ) {

    if ( this.progreso >= 100 && valor > 0 ) {
      return;
    }
    if ( this.progreso <= 0 && valor < 0 ) {
      return;
    }
    // tslint:disable-next-line: radix
    this.progreso = Number.parseInt( this.progreso.toString() ) + valor;
    this.cambioValor.emit( this.progreso );
    this.textProgress.nativeElement.focus();
  }

  onChange( newValue ) {

    // let elemHTML = document.getElementsByName('progreso')[0];
    
    if ( newValue >= 100 ) {
      this.progreso = 100;
    } else if ( newValue < 0 ) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    this.textProgress.nativeElement.value = Number( this.progreso );
    this.cambioValor.emit( this.progreso );
  }

}
