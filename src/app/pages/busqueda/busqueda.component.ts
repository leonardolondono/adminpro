import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor(
    public ar: ActivatedRoute,
    public http: HttpClient
  ) {
    this.ar.params.subscribe( params => {
      const termino = params.termino;
      this.buscar(termino);
    });
  }

  ngOnInit() {
  }

  buscar( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/todo/' + termino;

    this.http.get( url )
      .subscribe( (resp: any) => {
        this.hospitales = resp.hospitales;
        this.medicos = resp.medicos;
        this.usuarios = resp.usuarios;
      });

  }

}
