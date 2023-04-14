import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EstudianteModule } from '../module/estudiante/estudiante.module';
import { MateriaProfesorModule } from '../module/materia-profesor/materia-profesor.module';

import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Functions } from '../functions/functions';


@Injectable({
    providedIn: 'root'
})
export class Service {

    constructor(private http: HttpClient,
        private router: Router,
        private functions: Functions) {

    }

    estaAutenticado(): boolean {
        if (localStorage.getItem('idestudiante')) {
            return true;
        } else {
            return false;
        }
    }

    loginSigner(estudiante: EstudianteModule) {
        return this.http.post(`${environment.url}Estudiante`, estudiante).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }

    ConsultaMateriaProfesor() {
        return this.http.get(`${environment.url}MateriaProfesor`).pipe(
            map((resp: any) => {
                return resp;
            })
        );

    }

    GuardarMaterias(materiaprofesor: MateriaProfesorModule[]) {
        const data = {
            id: this.functions.functionEncryDesc('desencriptar', localStorage.getItem('idestudiante') || ''),
            materias: materiaprofesor
        }
        return this.http.post(`${environment.url}Asignaciones`, data).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }

    ConsultarMateriaAsignadas(id: string): Promise<any> {
        return this.http.get(`${environment.url}Asignaciones?id=${id}`).toPromise();
    }

    consultarRegistros() {
        return this.http.get(`${environment.url}Estudiante`).pipe(
            map((resp: any) => {
                return resp;
            })
        );

    }

    consultarCalses(id: string) {
        return this.http.get(`${environment.url}MateriasEstudiante?id=${id}`).pipe(
            map((resp: any) => {
                return resp;
            })
        );
    }

}