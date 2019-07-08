import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Pricipal',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url: '/dashboard' },
        { titulo: 'ProgressBar', url: '/progress' },
        { titulo: 'Promesas', url: '/promesas' },
        { titulo: 'Gráficas', url: '/graficas1' },
        { titulo: 'Rxjs', url: '/rxjs' },
      ]
    }
  ];

  constructor() { }
}
