import { Usuario } from './../../models/usuario.model';
import { SidebarService } from './../../services/service.index';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  usuario: Usuario;

  constructor( public sbs: SidebarService,
               public us: UsuarioService ) { }

  ngOnInit() {
    this.usuario = this.us.usuario;
  }

}
