import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {  NavigationEnd } from '@angular/router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import { LoginService } from '../services/login.service';


const notyf = new Notyf({
  duration: 3000, 
  position: {
    x: 'right',
    y: 'top',     
  },
});


@Component({
  selector: 'app-login',
  standalone: true, // define como standalone
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'

})
export class LoginComponent implements OnInit {
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
/*
alterarSenha() {
  if (this.recuperarForm.valid) {
    const email = this.recuperarForm.get('gmail')?.value;
    const senha = this.recuperarForm.get('senha')?.value;

    const dados = { email, senha };

    this.loginService.recuperarSenha().subscribe({
      next: () => {
        this.mostrarModal = false;
        notyf.success('Senha alterada com sucesso!');
        this.mensagemLogin = 'Senha alterada com sucesso!';
        this.tipoMensagem = 'sucesso';
      },
      error: () => {
        this.mensagemLogin = 'Erro ao alterar a senha. Verifique o email.';
        this.tipoMensagem = 'erro';
       
      }
    });
  } else {
    notyf.error('Usuário não encontrado ou erro ao alterar a senha.');
    this.recuperarForm.markAllAsTouched();
  }
}

*/
alterarSenha(){}
entrar() {
  if (this.loginForm.valid) {
    const usuario = {
      email: this.loginForm.get('email')?.value,
      senha: this.loginForm.get('senha')?.value
    };

    this.loginService.entrar(usuario).subscribe({
      next: (res: any) => {
        notyf.success('Login realizado com sucesso!');
        localStorage.setItem('token', res.token); // armazena o token
        this.router.navigate(['/telausuarios']); 
      },
      error: (error) => {
        console.error('Erro ao logar:', error);
        notyf.error('E-mail ou senha inválidos');
      }
    });

  } else {
    this.loginForm.markAllAsTouched();
    notyf.error('Preencha todos os campos corretamente.');
  }
}

  cadastro(){
   
    this.router.navigate(['/cadastro']);
  }

  
}