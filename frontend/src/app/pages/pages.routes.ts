import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { GraphicsComponent } from './graphics/graphics.component';
import { ProfileComponent } from './profile/profile.component';

import { LoginGuardGuard, VerificaTokenGuard, UserGuard } from '../services/service.index';
import { SolicitarCitaComponent } from './citas/solicitar-cita/solicitar-cita.component';
import { CitasComponent } from './citas/citas.component';
import { CitasDiariasComponent } from './citas/citas-diarias.component';
import { UserOrMedGuard } from '../services/guards/user-or-med.guard';
import { CitasRealizadasComponent } from './citas/citas-realizadas/citas-realizadas.component';



const PAGE_ROUTES: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate : [ LoginGuardGuard ],
        children : [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate : [VerificaTokenGuard],
                data : {titulo : 'Dashboard'}
            },
            { path: 'progress', component: ProgressComponent, data : { titulo : 'Progress'}},
            { path: 'graphics', component: GraphicsComponent, data : {titulo : 'Gráficas'} },
            { path: 'profile', component: ProfileComponent, data : { titulo : 'Perfil de Usuario'}},
            {
              path: 'solicitarCita',
              component: SolicitarCitaComponent,
              canActivate : [ UserGuard ],
              data : { titulo : 'Solicitar Cita'}
            },
            {
              path: 'citas',
              component: CitasComponent,
              data : { titulo : 'Solicitar Cita'}
            },
            {
              path: 'citasDiarias',
              component: CitasDiariasComponent,
              data : { titulo : 'Ver Cita'}
            },
            {
              path: 'citasRealizadas',
              canActivate : [UserOrMedGuard],
              component: CitasRealizadasComponent,
              data : { titulo : 'Citas Realizadas'}
            },
            { path: '', redirectTo: '/dashboard', pathMatch : 'full' },
        ]
    }
];

// ForCHild() porque este archivo de rutas esta dentro de otro archivo de rutas,
// es decir tenemos un router-oulet que esta dentro de otro router-outlet
export const PAGES_ROUTING = RouterModule.forChild(PAGE_ROUTES);
