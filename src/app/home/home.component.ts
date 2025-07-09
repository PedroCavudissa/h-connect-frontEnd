import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { LoginComponent } from "../login/login.component";
import { CadastroComponent } from "../cadastro/cadastro.component"; 
import { RecuperarComponent } from '../recuperar/recuperar.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, LoginComponent, CadastroComponent, RecuperarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor( private router: Router) {}
  menuAtivo = false;
  mostrarModal = false;
  nome = '';
  email = '';
  mensagem = '';
  notyf = new Notyf({
    duration: 3000, 
    position: {
      x: 'right',
      y: 'top',     
    },
  });
  toggleMenu(): void {
    this.menuAtivo = !this.menuAtivo;
   
  
  }
  show() {
    this.modalAberto = 'login';
  }
  
enviarMensagem() {
  if (!this.nome || !this.email || !this.mensagem) {
    this.notyf.error('Por favor, preencha todos os campos.');
    return;
  }

  this.notyf.success('Mensagem enviada com sucesso!');
  
  // Limpar campos
  this.nome = '';
  this.email = '';
  this.mensagem = '';
}
modalAberto: 'login' | 'cadastro' | 'recuperar' | null = null;

abrirModal(tipo: 'login' | 'cadastro' | 'recuperar') {
  this.modalAberto = tipo;
}

fecharModal() {
  this.modalAberto = null;
}

}


