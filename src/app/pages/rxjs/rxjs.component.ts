import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {
    this.subscription = this.regresaObservable().pipe(
    )
    .subscribe(
      numero => console.log('Subs', numero),
      error => console.log('Error'),
      () => console.log('Terminó')
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( (observer: any) => {
      let contador = 0;
      const intervalo = setInterval( () => {
        contador ++;

        const salida = {
          valor: contador
        };

        observer.next( salida );
        /*if ( contador === 3 ) {
          clearInterval( intervalo );
          observer.complete();
        }*/
      }, 1000 );
    }).pipe(
      retry(2),
      map( (resp: any) => {
        return resp.valor;
      }),
      filter( ( valor , index ) => {
        if ( (valor % 2) === 1 ) {
          return true;
        }
        return false;
      } )
    );
  }

}
