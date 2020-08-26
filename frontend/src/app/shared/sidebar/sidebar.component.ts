import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { SidebarService } from '../../services/shared/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  usuario : Usuario;
  tipoFoto : string = "";
  
  constructor(public loginService : LoginService,
              public sideBarService : SidebarService) { 
        this.tipoFoto = loginService.role === "ADMIN_ROLE" ? 'admin' : loginService.role === "MED_ROLE" ? "medico" : "usuarios"; 
  }

  ngOnInit() {
    this.usuario = this.loginService.currentUser;
    this.sideBarService.loadMenu();
  }

  ngDoCheck(): void {
    this.usuario = this.loginService.currentUser;
  }
}
