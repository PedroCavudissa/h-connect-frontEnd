import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {  NavigationEnd } from '@angular/router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import { LoginService } from '../services/login.service';




@Component({
  selector: 'app-login',
  standalone: true, // define como standalone
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'

})
export class LoginComponent implements OnInit {
  
 notyf = new Notyf({
  duration: 3000, 
  position: {
    x: 'right',
    y: 'top',     
  },
});
  @Output() fechar = new EventEmitter<void>();
  @Output() trocarCadastro = new EventEmitter<void>();
  @Output() recuperarSenha = new EventEmitter<void>();
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.mostrarSidebar = event.url !== '/login';
      }
    });
  }
  
  mostrarRecuperar = false;
  mostrarCadastro=false;
  mostrarSidebar = true;
  mensagemLogin = '';
tipoMensagem: 'erro' | 'sucesso' | '' = '';
mostrarModal = false;
recuperarForm!: FormGroup;
  loginForm!: FormGroup;
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      senha: ['', Validators.required]
    });

  this.recuperarForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });
}
  
// Senha esquecida
  abrirModal(event: Event) {
      event.preventDefault();
    this.mostrarModal = true;
}
fecharModal() {
  this.mostrarModal = false;
}

alterarSenha(){
  if (this.recuperarForm.invalid) {
    this.notyf.error('Preencha todos os campos corretamente!');
    return;
  }

  const { gmail, senha } = this.recuperarForm.value;

  // Simulação do envio
  console.log('Simulando envio para:', gmail, 'Nova senha:', senha);

  this.notyf.success('E-mail de recuperação enviado com sucesso!');
  this.recuperarForm.reset();
  this.mostrarRecuperar = false;
}

entrar() {
  if (this.loginForm.valid) {
    const usuario = {
      email: this.loginForm.get('email')?.value,
      senha: this.loginForm.get('senha')?.value
    };

    this.loginService.entrar(usuario).subscribe({
      next: (res: any) => {
        this.notyf.success('Login realizado com sucesso!');
        localStorage.setItem('token', res.token); // armazena o token
        this.router.navigate(['/telausuarios']); 
      },
      error: (error) => {
        console.error('Erro ao logar:', error);
        this.notyf.error('E-mail ou senha inválidos');
      }
    });

  } else {
    this.loginForm.markAllAsTouched();
    this.notyf.error('Preencha todos os campos corretamente.');
  }
}

  cadastro(){
   
    this.router.navigate(['/cadastro']);
  }
}
  
