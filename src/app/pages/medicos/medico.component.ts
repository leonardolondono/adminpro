import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { NgForm } from '@angular/forms';
import { MedicoService, HospitalService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ThemeService } from 'ng2-charts';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  medico: Medico = new Medico('', '', '', '', '');
  hospitales: Hospital[] = [];
  hospital: Hospital = new Hospital('');

  constructor(
    public ms: MedicoService,
    public hs: HospitalService,
    public router: Router,
    public ar: ActivatedRoute,
    public mus: ModalUploadService
  ) {
    this.ar.params.subscribe( params => {
      let id = params['id'];

      if ( id !== 'nuevo ') {
        this.cargarMedico( id );
      }
    })
  }

  ngOnInit() {
    this.hs.cargarHospitales()
      .subscribe( (resp: any) => this.hospitales = resp.hospitales);
    this.mus.notificacion
      .subscribe( (resp: any) => {
        
        this.medico.img = resp.medico.img;
      })
  }

  cargarMedico( id: string ) {
    this.ms.cargarMedico( id )
      .subscribe( medico => {
        this.medico = medico;
        this.medico.hospital = medico.hospital._id;
        this.cambioHospital( this.medico.hospital );
      } );
  }

  guardarMedico( f: NgForm ) {
    if( f.invalid ) {
      return;
    }

    this.ms.guardarMedico( this.medico )
      .subscribe( medico => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico', medico._id])
      } );
  }

  cambioHospital( id: string ) {
    if( id === '' ){
      
    }

    this.hs.obtenerHospital( id )
      .subscribe( hospital => {
        this.hospital = hospital;
      })
  }

  cambiarFoto() {
    this.mus.mostrarModal( 'medicos', this.medico._id );
  }
}
