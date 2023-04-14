import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Functions } from '../../functions/functions';
import { EstudianteModule } from '../../module/estudiante/estudiante.module';
import { Service } from 'src/app/services/service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.css']
})
export class EstudianteComponent implements OnInit {

  formulario = new FormGroup({
    nombre: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  estudiante = new EstudianteModule();

  constructor(private FormBuilder: FormBuilder,
    private functions: Functions,
    private service: Service,
    private router: Router) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    localStorage.clear();
  }
  get nombreNoValido() {
    return this.formulario.get('nombre')?.invalid && this.formulario.get('nombre')?.touched;
  }


  get emailNoValido() {
    return this.formulario.get('email')?.invalid && this.formulario.get('email')?.touched;
  }

  get passwordNoValido() {
    return this.formulario.get('password')?.invalid && this.formulario.get('password')?.touched;
  }

  crearFormulario() {
    this.formulario = this.FormBuilder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  guardar() {
    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
          control.markAsTouched();
        }
      });
    } else {
      this.estudiante.nombre = this.formulario.value.nombre!.toString();
      this.estudiante.email = this.formulario.value.email!.toString();
      this.estudiante.password = this.formulario.value.password!.toString();

      this.functions.PopUpAlert('', 'info', 'Espere por favor', false, true);
      localStorage.setItem('nombre', this.functions.functionEncryDesc('encriptar', this.estudiante.nombre));
      this.service.loginSigner(this.estudiante).subscribe({
        next: (res) => this.nextLoginSigner(res),
        error: (err) => this.functions.PopUpAlert('Error en el servidor', 'error', err.error, true, false)
      });

    }
  }

  nextLoginSigner(res: any) {
    if (res == 0) {
      this.functions.PopUpAlert('', 'error', `El correso ya se encuentra registrado ${this.estudiante.email}`, true, false)
    } else {
      localStorage.setItem('idestudiante', this.functions.functionEncryDesc('encriptar', res));
      this.functions.PopUpAlertClose();
      this.router.navigateByUrl('/asignaciones');
    }
  }

}
