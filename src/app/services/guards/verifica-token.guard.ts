import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate  {

  constructor(
    public us: UsuarioService,
    public router: Router
    ) {}

  canActivate(): Promise<boolean> | boolean {

    const token = this.us.token;
    const payload = JSON.parse( atob( token.split('.')[1] ) );

    const expirado = this.expirado( payload.exp );

    if ( expirado ) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenuva( payload.exp );
  }

  verificaRenuva( fechaExp: number): Promise<boolean> {
    return new Promise( (resolve, reject ) => {
      const tokenExp = new Date( fechaExp * 1000 );
      const ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 1 * 60 * 60 * 1000 ) );

      if ( tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {
        this.us.renuevaToken()
          .subscribe( () => {
            resolve(true)
          }, () => {
            this.router.navigate(['/login']);
            reject(false);
          });
      }
    });
  }

  expirado( fechaExp: number ) {
    const ahora = new Date().getTime() / 1000;

    if ( fechaExp < ahora ) {
      return true;
    } else {
      return false;
    }

  }
}
