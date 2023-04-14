import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Functions } from '../../functions/functions';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router } from '@angular/router';
import { Service } from 'src/app/services/service';
import { MateriaProfesorModule } from '../../module/materia-profesor/materia-profesor.module';
import { EstudianteModule } from '../../module/estudiante/estudiante.module';

@Component({
  selector: 'app-asignaciones',
  templateUrl: './asignaciones.component.html',
  styleUrls: ['./asignaciones.component.css']
})
export class AsignacionesComponent implements OnInit {
  nombre: String = "";

  formulario = new FormGroup({
    cursos: new FormControl(),
  });

  dropdownList = [];

  dropdownListAsig = [];

  materiaprofesor: MateriaProfesorModule[] = [];

  registrosestudi: EstudianteModule[] = [];

  estudMater: String[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id_materia_profesor',
    textField: 'nombre',
    itemsShowLimit: 10,
    allowSearchFilter: false,
    enableCheckAll: false,
    limitSelection: 3
  };

  constructor(private functions: Functions,
    private FormBuilder: FormBuilder,
    private router: Router,
    private service: Service) {
    this.nombre = this.functions.functionEncryDesc('desencriptar', localStorage.getItem('nombre') || '');
    this.crearFormulario();
    this.service.ConsultaMateriaProfesor().subscribe({
      next: (res) => this.dropdownList = res,
      error: (err) => this.functions.PopUpAlert('Error en el servidor', 'error', '', true, false)
    });
    this.service.ConsultarMateriaAsignadas(this.functions.functionEncryDesc('desencriptar', localStorage.getItem('idestudiante') || '')).then((response) => {
      this.dropdownListAsig = response;
      this.cargarDataFormulario();
    }).catch((error) => {
      this.functions.PopUpAlert('Error en el servidor', 'error', error, true, false)
    })


  }

  ngOnInit(): void {

  }

  get cursosNoValido() {
    return this.formulario.get('cursos')?.invalid && this.formulario.get('cursos')?.touched;
  }

  crearFormulario() {
    this.formulario = this.FormBuilder.group({
      cursos: [, [Validators.required]]
    });
  }

  cargarDataFormulario() {
    this.formulario.reset({
      cursos: this.dropdownListAsig
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
    } else if (this.formulario.value.cursos.length < 3) {
      this.functions.PopUpAlert('', 'error', 'Debe escoger tres cursos', true, false);
    } else {
      this.functions.PopUpAlert('', 'info', 'Espere por favor', false, true);
      this.materiaprofesor = this.formulario.value.cursos;
      this.service.GuardarMaterias(this.materiaprofesor).subscribe({
        next: (res) => this.functions.PopUpAlert('', 'success', res, true, false),
        error: (err) => this.functions.PopUpAlert('Error en el servidor', 'error', '', true, false)
      });

    }
  }

  onItemSelect(item: any) {
    if (this.formulario.value.cursos.length > 1) {
      for (const element of this.formulario.value.cursos) {
        let array_ini = element.nombre.split('-');
        let cont = 0;
        for (const array of this.formulario.value.cursos) {
          let array_arre = array.nombre.split('-');
          if (array_ini[1] === array_arre[1]) {
            cont++;
          }
          if (cont == 2) {
            this.errorDupliProfe(array_arre[1]);
            break;
          }
        }
      }
    }
  }

  verRegistros() {
    this.service.consultarRegistros().subscribe({
      next: (res) => this.registrosestudi = res,
      error: (err) => this.functions.PopUpAlert('Error en el servidor', 'error', '', true, false)
    });
  }

  verClases() {
    this.service.consultarCalses(this.functions.functionEncryDesc('desencriptar', localStorage.getItem('idestudiante') || '')).subscribe({
      next: (res) => this.estudMater = res,
      error: (err) => this.functions.PopUpAlert('Error en el servidor', 'error', '', true, false)
    });
  }

  errorDupliProfe(profesor: String) {
    this.functions.PopUpAlert('', 'error', `No puedes tener más de una clase con el mismo profesor ${profesor}`, true, false);
    this.formulario.reset({
      cursos: this.dropdownListAsig
    });
  }
  CerrarSesion() {
    this.router.navigateByUrl('/estudiante');
  }
}
