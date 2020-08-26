/* Archivo de rutas principales */
import { RouterModule, Routes } from '@angular/router';

/* Components in this route */
import { LoginComponent } from './login/login.component';
import { NopagefoundComponent } from './shared/nopagefound/nopagefound.component';
import { RegisterComponent } from './login/register.component';
import { BlockLoginGuard } from './services/guards/block-login.guard';


export const APP_ROUTES: Routes = [
    {
        path: 'login',
        canActivate : [BlockLoginGuard],
        component: LoginComponent
    },
    {
        path: 'register',
        canActivate : [BlockLoginGuard],
        component: RegisterComponent
    },
    { path: '**', component : NopagefoundComponent }
];

