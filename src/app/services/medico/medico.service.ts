import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert2';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor( public http: HttpClient, public us: UsuarioService ) { }

  cargarMedicos( desde: number = 0 ) {
    const url = URL_SERVICIOS + '/medico';

    return this.http.get( url )
      .pipe(
        map( (resp: any) => {
          this.totalMedicos = resp.medicos.length;
          return resp.medicos;
        })
      );
  }

  buscarMedicos( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get( url )
        .pipe(
          map( ( resp: any ) => resp.medicos )
        );
  }

  borrarMedico( id: string ) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this.us.token;

    return this.http.delete( url )
        .pipe(
          map( ( resp: any ) => {
            swal.fire({
              title: 'Médico borrado',
              text: 'El médico ha sido eliminado correctamente',
              type: 'success'
            });
            return true;
          })
        );
  }

  guardarMedico( medico: Medico ) {
    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      // Actualizando 
      url += '/' + medico._id;
      url += '?token=' + this.us.token;

      return this.http.put( url, medico )
      .pipe(
        map( (resp: any) => {
          swal.fire({
            title: 'Médico actualizado',
            text: medico.nombre,
            type: 'success'
          });
          return resp.medico;
        })
      );
    } else {
      // Creando 
      url += '?token=' + this.us.token;
      return this.http.post( url, medico )
        .pipe(
          map( (resp: any) => {
            swal.fire({
              title: 'Médico creado',
              text: medico.nombre,
              type: 'success'
            });
            return resp.medico;
          })
        );
    }

  }

  cargarMedico( id: string ) {
    const url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get( url )
        .pipe(
          map( ( resp: any ) => resp.medico )
        );
  }
}
