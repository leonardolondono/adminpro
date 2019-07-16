import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  constructor( public sas: SubirArchivoService, public mus: ModalUploadService) {}

  ngOnInit() {
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

  subirImagen() {
    this.sas.subirArchivo( this.imagenSubir, this.mus.tipo, this.mus.id )
      .then( resp => {
        this.mus.notificacion.emit( resp );
        this.cerrarModal();
      })
      .catch( resp => {
        console.log('Error en la carga');
      });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this.mus.ocultarModal();
  }

}
