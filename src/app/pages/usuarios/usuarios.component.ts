import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { subscribeOn } from 'rxjs/operators';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor( public us: UsuarioService, public mus: ModalUploadService ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.mus.notificacion
      .subscribe( resp => this.cargarUsuarios() );
  }

  cargarUsuarios() {
    this.cargando = true;
    this.us.cargarUsuarios( this.desde )
        .subscribe( (resp: any) => {
          console.log( resp );
          this.totalRegistros = resp.total;
          this.usuarios = resp.usuarios;
          this.cargando = false;
        });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.us.buscarUsuarios( termino )
          .subscribe( ( usuarios: Usuario[] ) => {
            this.usuarios = usuarios;
            this.cargando = false;
          });
  }

  borrarUsuario( usuario: Usuario ) {
    if ( usuario._id === this.us.usuario._id ) {
      Swal.fire({
        title: 'No puede borrar usuario',
        text: 'No se puede borrar a si mismo',
        type: 'error'
      });
      return;
    }

    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar!'
    }).then( (result) => {
      console.log(result);
      if (result.value) {
        this.us.borrarUsuario( usuario._id )
            .subscribe( resp => {
              console.log( resp );
              this.cargarUsuarios();
            });
      }
    });
  }

  guardarUsuario( usuario: Usuario ) {
    this.us.actualizarUsuario( usuario )
      .subscribe();
  }

  mostrarModal( id: string ) {
    this.mus.mostrarModal( 'usuarios', id );
  }

}
