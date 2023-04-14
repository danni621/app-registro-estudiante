import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Service } from 'src/app/services/service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private service: Service,
        private router: Router) { }

    canActivate(): boolean {
        if (this.service.estaAutenticado()) {
            return true;
        } else {
            this.router.navigateByUrl('/estudiante');
            return false;
        }
    }

}
