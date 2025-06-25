import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor( private router: Router) {}
  menuAtivo = false;
  mostrarModal = false;

  toggleMenu(): void {
    this.menuAtivo = !this.menuAtivo;
   
  
  }
  show(){
    this.router.navigate(['/login']);
  }
  abrirModal(event: Event) {
    event.preventDefault();
  this.mostrarModal = true;
}
fecharModal() {
this.mostrarModal = false;
}
}
