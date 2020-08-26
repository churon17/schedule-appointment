/* Componente de Pages, donde esta todo el contenido */
/* Módulo meramente para pages */
import { NgModule } from '@angular/core';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
/* Componentes de este Módulo */
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { GraphicsComponent } from './graphics/graphics.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';

/* Módulos personalizados adicionales necesarios en este módulo*/
import { SharedModule } from '../shared/shared.module';


/*Archivo de rutas de este módulo */
import { PAGES_ROUTING } from './pages.routes';

/* Pipes Module */
import { PipesModule } from '../pipes/pipes.module';
import { CitasComponent } from './citas/citas.component';
import { SolicitarCitaComponent } from './citas/solicitar-cita/solicitar-cita.component';
import { CitasDiariasComponent } from './citas/citas-diarias.component';
import { HistorialComponent } from './historial/historial.component';
import { CitasRealizadasComponent } from './citas/citas-realizadas/citas-realizadas.component';



@NgModule({
    declarations: [
        DashboardComponent,
        ProgressComponent,
        GraphicsComponent,
        PagesComponent,
        ProfileComponent,
        ModalUploadComponent,
        CitasComponent,
        SolicitarCitaComponent,
        CitasDiariasComponent,
        HistorialComponent,
        CitasRealizadasComponent
    ],
    imports: [
        SharedModule,
        PAGES_ROUTING,
        PipesModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        FullCalendarModule
    ],
    exports: [
        /* Porque necesitamos de estos componentes en otros lados */
        DashboardComponent,
        ProgressComponent,
        GraphicsComponent
    ],
    providers: [],
})

export class PagesModule {}
