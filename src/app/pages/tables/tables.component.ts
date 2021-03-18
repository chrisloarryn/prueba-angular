import { Component, OnInit } from '@angular/core';
import { IUser, IUserRespond } from 'src/app/interfaces/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import omit from 'lodash/omit';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
})
export class TablesComponent implements OnInit {
  users: IUser[] = [];
  usersFemale: IUser[] = [];
  usersMale: IUser[] = [];

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  makeValidUser(user: IUserRespond): IUser {
    const modifiedUser = {
      ...omit(user, 'name'),
      name: `${user.name.firstName} ${user.name.lastName}`,
    };
    return modifiedUser as IUser;
  }

  ngOnInit() {
    const url = `${environment.URL_BASE}${environment.URL_ENDPOINT}`;
    this.http.get(url).subscribe(
      (data: IUserRespond[]) => {
        this.users = data.map((element: IUserRespond) => this.makeValidUser(element));
        this.usersMale = data
          .filter((element: IUserRespond) => element?.gender === 'M')
          .map((element: IUserRespond) => this.makeValidUser(element))
        this.usersFemale = data
          .filter((element: IUserRespond) => element?.gender === 'F')
          .map((element: IUserRespond) => this.makeValidUser(element))
        this.toastr.success('Datos cargados correctamente', 'Ok')
      },
      (err) => {
        console.log('error', err);
        this.toastr.error('error', 'ERROR')
      }
    );
  }
}
// ENDPOINT Y URLBASE ubicados en archivo environments.ts
// Está prohibido alterar el componente table-test
// Mostrar como máximo 10 registros en cada tabla
// TODO 1 Consumir Servicio por método get para obtener data y llenar la primera tabla users
// TODO 1.1 En el nombre concatenar firstName y lastName con un espacio entre ellos
// TODO 2 Llenar la 2da tabla de usersFemale únicamente con registros donde gender sea correspondiente a 'F'
// TODO 2.1 Llenar la 3ra tabla de usersMale únicamente con registros donde gender sea correspondiente a 'M'
