import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame: boolean = false;
  correo: string;

  // Google
  auth2: any;

  constructor( public router: Router,
               public us: UsuarioService,
               private ngZone: NgZone ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.correo = localStorage.getItem('email') || '';
    if ( this.correo.length > 1 ) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '111390549764-vgv6h73nft49lsr5d8rr67j3tvpi9rhi.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle') );
    });
  }

  attachSignin( element ) {
    this.auth2.attachClickHandler( element, {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile();

      const token = googleUser.getAuthResponse().id_token;
      this.us.loginGoogle( token )
        .subscribe( resp => this.ngZone.run( () => this.router.navigate( ['/dashboard'] ) ) );
    });
  }

  ingresar( forma: NgForm ) {

    if ( forma.invalid ) {
      return;
    }

    const usuario = new Usuario(null, forma.value.correo, forma.value.password);

    this.us.login( usuario, this.recuerdame )
          .subscribe( resp => this.router.navigate( ['/dashboard'] ) );
  }

}
