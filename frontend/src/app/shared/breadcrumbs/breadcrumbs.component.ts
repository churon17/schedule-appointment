import { Component, OnInit } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  titulo : string;

  constructor(private router : Router,
              private title : Title,
              private meta : Meta) { 
        
    this.getDataRoute().subscribe( data => {
      this.titulo = data.titulo;
      this.title.setTitle(this.titulo);

      const metaTag : MetaDefinition = {
        name : 'description',
        content : `Estamos en la página ${this.titulo}`
      };

      this.meta.updateTag(metaTag);
    });


  }

  ngOnInit() {
  }

  getDataRoute(){
    return this.router.events.pipe(
      filter( (evento) => evento instanceof ActivationEnd),
      filter ( (evento: ActivationEnd) => evento.snapshot.firstChild === null ),
      map((response : ActivationEnd) => response.snapshot.data)
    );
  }

}
