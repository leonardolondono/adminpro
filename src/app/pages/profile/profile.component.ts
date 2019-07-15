import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/service.index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: string;

  constructor( public us: UsuarioService ) {
    this.usuario = this.us.usuario;
  }

  ngOnInit() {
  }

  guardar( usuario: Usuario ) {
    this.usuario.nombre = usuario.nombre;

    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }
    this.us.actualizarUsuario( this.usuario ).subscribe( resp => {
      console.log(resp);
    });
  }

  seleccionImagen( archivo ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
      Swal.fire({
        title: 'Sólo imágenes',
        text: 'El archivo seleccionado no es una imagen',
        type: 'error'
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImageTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result.toString();
  }

  cambiarImagen() {
    this.us.cambiarImagen( this.imagenSubir, this.usuario._id );
  }

}
