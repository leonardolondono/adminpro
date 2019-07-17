import swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';

import { URL_SERVICIOS } from './../../config/config';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( public http: HttpClient, public us: UsuarioService ) {}

  crearHospital( hospital: Hospital ) {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this.us.token;


    return this.http.post( url, hospital )
      .pipe(
        map( (resp: any) => {
          swal.fire({
            title: 'Hospital creado',
            text: hospital.nombre,
            type: 'success'
          });
          return resp.hospital;
        })
      );
  }

  cargarHospitales() {
    const url = URL_SERVICIOS + '/hospital';
    return this.http.get( url );
  }

  obtenerHospital( id: string ) {
    const url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get( url )
      .pipe(
        map( ( resp: any ) => resp.hospital )
      );
  }

  buscarHospitales( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get( url )
        .pipe(
          map( ( resp: any ) => resp.hospitales )
        );
  }

  actualizarHospital( hospital: Hospital ) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this.us.token;

    return this.http.put( url, hospital)
      .pipe(
        map( (resp: any) => {

          swal.fire({
            title: 'Hospital actualizado',
            text: hospital.nombre,
            type: 'success'
          });

          return true;
        })
      );
  }

  borrarrHospital( id: string ) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this.us.token;

    return this.http.delete( url )
        .pipe(
          map( ( resp: any ) => {
            swal.fire({
              title: 'Hospital borrado',
              text: 'El hospital ha sido eliminado correctamente',
              type: 'success'
            });
            return true;
          })
        );
  }
}
