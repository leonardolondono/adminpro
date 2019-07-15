import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor( public us: UsuarioService,
               public router: Router ) {}

  canActivate() {
    if ( this.us.estaLogueado() ) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
