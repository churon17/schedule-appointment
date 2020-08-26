/* Componente de Pages, donde esta todo el contenido */
/* Módulo meramente para pages */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

import {
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    LoginService,
    LoginGuardGuard,
    SubirArchivoService,
    VerificaTokenGuard,
    MedicoService,
    EspecialidadService,
    MedGuard,
    UserGuard,
    UserOrMedGuard
} from './service.index';


@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    exports: [
    ],
    providers: [
        SettingsService,
        SidebarService,
        SharedService,
        UsuarioService,
        LoginService,
        LoginGuardGuard,
        SubirArchivoService,
        ModalUploadService,
        VerificaTokenGuard,
        MedicoService,
        EspecialidadService,
        MedGuard,
        UserGuard,
        UserOrMedGuard
    ],
})

export class ServicesModule { }
