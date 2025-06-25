import { Component } from '@angular/core';
import { BarralateralComponent } from '../barralateral/barralateral.component';
import { Router } from '@angular/router';
import { Mensagem } from '../../app.config';
import {ToastrService} from 'ngx-toastr';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-telausuarios',
  imports: [BarralateralComponent,CommonModule,FormsModule],
  templateUrl: './telausuarios.component.html',
  styleUrl: './telausuarios.component.css',
})
export class TelausuariosComponent {
  notyf = new Notyf({
    duration: 3000, 
    position: {
      x: 'right',
      y: 'top',     
    },
  });
  mensagens: Mensagem[] = [
    {
      id: 1,
      remetente: 'João',
      destinatario: 'Maria',
      conteudo: 'Olá, tudo bem?',
      data: new Date('2025-05-01T14:30:00')
    }
  ];
  novaPublicacao: string = ''; // conteúdo digitado
  publicacoes: any[] = [
    {
      autor: 'Luís Domingos',
      conteudo: 'Compartilhando um novo projeto incrível!',
      imagem: 'assets/imagens/projeto1.jpg',
      likes: 3,
      comentarios: [],
      conectado: true,
      curtiu:false
    },
    {
      autor: 'Ana Capita',
      conteudo: 'Alguém disponível para colaboração em FP?',
      imagem: '',
      likes: 1,
      comentarios: [],
      conectado: false,
      curtiu:false
    },
  ];

  
  constructor(private router: Router,private toastr: ToastrService) {}
  verDetalhes(nome: string): void {
    switch (nome) {
      case 'Projetos':
        this.router.navigate(['/projecto']);
        break;
      case 'Publicações':
        this.router.navigate(['/publicacoes']);
        break;
      case 'Mensagens':
        this.router.navigate(['mensagens/']);
        break;
      case 'Conexões':
        this.router.navigate(['/conexoes']);
        break;
      default:
       this. notyf.success('Dados não disponíveis');
    }
  }



  
  curtirPost(post: any) {
    if (!post.curtiu) {
      post.likes++;
      post.curtiu = true;
      this.notyf.success('Você curtiu a publicação!');
    } else {
      post.likes--;
      post.curtiu = false;
      this.notyf.success('Você removeu seu like.');
    }
  }
  

  comentarPost(post: any, input: HTMLInputElement) {
    const texto = input.value.trim();
    if (texto.length === 0) return;

    post.comentarios.push({ autor: 'Você', texto });
    input.value = '';
    this.notyf.success('Comentário adicionado!');
  }

  conectarCom(usuario: string) {
    this.notyf.success(`Solicitação de conexão enviada para ${usuario}`);
  }

 

  criarPublicao() {
    this.notyf.success('Redirecionando para página de publicações...');
  }

  verMais() {
    this.notyf.success('Exibindo mais publicações...');
    this.router.navigate(['/publicacoes'])
  }
  publicar() {
    const conteudo = this.novaPublicacao.trim();
    if (conteudo.length === 0) return;
  
    this.publicacoes.unshift({
      autor: 'Você',
      conteudo,
      imagem: '',
      likes: 0,
      comentarios: [],
      conectado: true,
    });
  
    this.novaPublicacao = '';
    this.notyf.success('Publicação feita com sucesso!');
  
}
}
