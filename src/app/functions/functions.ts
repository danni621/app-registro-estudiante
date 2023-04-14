import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class Functions {
    texto: string = "";

    constructor(private router: Router) { }

    functionEncryDesc(tipo: string, cadena: string) {

        if (tipo === 'encriptar') {
            this.texto = CryptoJS.AES.encrypt(cadena.toString(), environment.claveCryto).toString();
        } else {
            this.texto = CryptoJS.AES.decrypt(cadena.toString(), environment.claveCryto).toString(CryptoJS.enc.Utf8);
        }

        return this.texto;
    }


    PopUpAlert(title: any, icon: any, text: any, allowOutsideClick: boolean = false, loading: boolean = false) {

        Swal.fire({
            allowOutsideClick: allowOutsideClick,
            title: title,
            icon: icon,
            text: text
        });

        if (loading)
            Swal.showLoading();

    }

    PopUpAlertConfirm(title: any, icon: any, text: any, allowOutsideClick: boolean = false, showConfirmButton: boolean = false, showCancelButton: boolean = false, ruta: string) {
        Swal.fire({
            allowOutsideClick: allowOutsideClick,
            title: title,
            text: text,
            icon: icon,
            showConfirmButton: showConfirmButton,
            showCancelButton: showCancelButton
        }).then(resp => {
            if (resp.value) {
                this.router.navigateByUrl(ruta);
            }
        });
    }

    PopUpAlertClose() {
        Swal.close();
    }


}