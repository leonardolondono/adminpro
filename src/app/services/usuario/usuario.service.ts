import { Router } from '@angular/router';
import { URL_SERVICIOS } from './../../config/config';
import { Usuario } from './../../models/usuario.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient,
               public router: Router,
               public subirA: SubirArchivoService ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICIOS + '/login/google';
    return this.http.post( url , { token })
        .pipe(
          map( (resp: any) => {
            this.guardarStorage(resp.id, resp.token, resp.usuario);
            return true;
          })
        );
  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if ( recordar ) {
      localStorage.setItem( 'email', usuario.email );
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';

    return this.http.post( url, usuario )
      .pipe(
        map( (resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
        })
      );
  }

  crearUsuario( usuario: Usuario ) {
    const url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
      .pipe(
        map( (resp: any) => {
          swal.fire({
            title: 'Usuario creado',
            text: usuario.email,
            type: 'success'
          });
          return resp.usuario;
        })
      );
  }

  actualizarUsuario( usuario: Usuario ) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    console.log(usuario);

    return this.http.put( url, usuario)
      .pipe(
        map( (resp: any) => {

          if ( usuario._id === this.usuario._id ) {
            const usuarioDB: Usuario = resp.usuario;
            this.guardarStorage( usuarioDB._id, this.token, usuarioDB );
          }
          swal.fire({
            title: 'Usuario actualizado',
            text: usuario.nombre,
            type: 'success'
          });

          return true;
        })
      );
  }

  cambiarImagen( archivo: File, id: string ) {
    this.subirA.subirArchivo( archivo, 'usuarios', id)
        .then( (resp: any) => {
          this.usuario.img = resp.usuario.img;
          swal.fire({
            title: 'Imagen actualizada',
            text: this.usuario.nombre,
            type: 'success'
          });

          this.guardarStorage( id, this.token, this.usuario );
        })
        .catch( resp => {
          console.log( resp );
        });
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get( url );
  }

  buscarUsuarios( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get( url )
        .pipe(
          map( ( resp: any ) => resp.usuarios )
        );
  }

  borrarUsuario( id: string ) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete( url )
        .pipe(
          map( ( resp: any ) => {
            swal.fire({
              title: 'Usuario borrado',
              text: 'El usuario ha sido eliminado correctamente',
              type: 'success'
            });
            return true;
          })
        );
  }

}
