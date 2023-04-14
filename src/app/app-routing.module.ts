import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstudianteComponent } from './pages/estudiante/estudiante.component';
import { AsignacionesComponent } from './pages/asignaciones/asignaciones.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'estudiante', component: EstudianteComponent },
  { path: 'asignaciones', component: AsignacionesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'estudiante', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
