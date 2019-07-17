import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  public medicos: Medico[] = [];
  cargando: boolean = true;


  constructor( public ms: MedicoService, public mus: ModalUploadService ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this.ms.cargarMedicos()
        .subscribe( medicos => {
          this.medicos = medicos;
          this.cargando = false;
        });
  }

  buscarMedico( termino: string ) {
    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    this.ms.buscarMedicos( termino )
          .subscribe( ( medicos: Medico[] ) => {
            this.medicos = medicos;
            this.cargando = false;
          });
  }

  borrarMedico( medico: Medico ) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Esta a punto de borrar el médico ' + medico.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar!'
    }).then( (result) => {
      if (result.value) {
        this.ms.borrarMedico( medico._id )
            .subscribe( resp => {
              this.cargarMedicos();
            });
      }
    });
  }

  guardarMedico( medico: Medico ) {
    //this.ms.actualizarMedico( medico )
    //  .subscribe();
  }

  mostrarModal( id: string ) {
    console.log( id );
    this.mus.mostrarModal( 'medicos', id );
  }

  crearMedicoModal() {
    Swal.fire({
      title: 'Crear Médico',
      text: 'Ingrese el nombre del médico',
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

      const hospTemp = new Medico( resp.value );

      //return this.ms.crearMedico( hospTemp )
      //  .subscribe( () => this.cargarMedicos());
    });
  }

}
