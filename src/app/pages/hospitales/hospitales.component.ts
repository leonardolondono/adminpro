import Swal from 'sweetalert2';
import { HospitalService } from './../../services/service.index';
import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  public hospitales: Hospital[] = [];
  cargando: boolean = true;

  constructor( public hs: HospitalService, public mus: ModalUploadService ) { }

  ngOnInit() {
    this.cargarHospitales();
    this.mus.notificacion
      .subscribe( resp => this.cargarHospitales() );
  }

  buscarHospital( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this.hs.buscarHospitales( termino )
          .subscribe( ( hospitales: Hospital[] ) => {
            this.hospitales = hospitales;
            this.cargando = false;
          });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hs.cargarHospitales()
        .subscribe( (resp: any) => {
          console.log(resp);
          this.hospitales = resp.hospitales;
          this.cargando = false;
        });
  }

  borrarHospital( hospital: Hospital ) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar el hospital ' + hospital.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar!'
    }).then( (result) => {
      if (result.value) {
        this.hs.borrarrHospital( hospital._id )
            .subscribe( resp => {
              console.log( resp );
              this.cargarHospitales();
            });
      }
    });
  }

  guardarHospital( hospital: Hospital ) {
    this.hs.actualizarHospital( hospital )
      .subscribe();
  }

  mostrarModal( id: string ) {
    console.log( id );
    this.mus.mostrarModal( 'hospitales', id );
  }

  crearHospitalModal() {
    Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Crear',
      allowOutsideClick: () => !Swal.isLoading()
    }).then(( resp: any) => {
      if ( !resp.value || resp.value.length === 0 ) {
        return;
      }
      console.log( resp.value );

      const hospTemp = new Hospital( resp.value );

      return this.hs.crearHospital( hospTemp )
        .subscribe( () => this.cargarHospitales());
    });
  }

}
