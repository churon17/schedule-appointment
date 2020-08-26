import { Component, OnInit} from '@angular/core';
import { LoginService } from '../../services/service.index';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario : Usuario;
  tipoFoto : string = "";

  constructor(public loginService : LoginService,
              public router : Router) {
          this.tipoFoto = loginService.role === "ADMIN_ROLE" ? 'admin' : loginService.role === "MED_ROLE" ? "medico" : "usuarios"; 
  }

  ngOnInit() {
    this.usuario = this.loginService.currentUser;
  }

  buscar(termino : string){
    this.router.navigate(['/busqueda', termino]);
  }

  ngDoCheck(): void {
    this.usuario = this.loginService.currentUser;
  }

}
