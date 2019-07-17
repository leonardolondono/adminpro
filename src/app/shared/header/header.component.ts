import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;

  constructor( public us: UsuarioService, public router: Router ) { }

  ngOnInit() {
    this.usuario = this.us.usuario;
  }

  buscar( value: string ) {
    this.router.navigate(['busqueda', value]);
  }

}
