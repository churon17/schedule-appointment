import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginService } from '../services/service.index';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// Fireauth
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from 'firebase';

declare function init_plugins();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email : string;
  recuerdame : boolean = false;
  auth2 : any;

  constructor(public router : Router,
              public loginService : LoginService,
              public fireAuth : AngularFireAuth,
              public ngZone : NgZone) { }

  ngOnInit() {
    init_plugins();
    this.email = localStorage.getItem('email') || "";
    if(this.email.length > 1){
      this.recuerdame = true;
    }
  }

  google(){
    this.fireAuth.signInWithPopup(new auth.GoogleAuthProvider()).then((response : any) =>{
      let email = response.user.email;
      let nombre = response.user.displayName;
      let foto = response.user.photoURL;



      let infoUser = {
        email,
        nombre,
        foto
      }
      console.log("InfoUser", infoUser);

      this.loginService.loginGoogle(infoUser).subscribe(response => {
        if(response){
          this.ngZone.run(() => {
            this.router.navigate(['/dashboard']);
          });
        }else{
          this.ngZone.run(() => {
            Swal.fire('IMPORTANTE', 'Por ser primera vez que ingresas a nuestro sistema,es necesario registrar más datos personales sobre usted', 'warning');
            this.router.navigate(['/register']);
          });
        }
      });
    });
  }


  ingresar(forma : NgForm){

    if (forma.invalid) return;

    let valueForm = forma.value;

    let usuario = {
      userName : valueForm.email,
      password :  valueForm.password
    }
    this.loginService.login(usuario, this.recuerdame)
                        .subscribe( isLogged => this.router.navigate(['/dashboard']));

  }
}
