import { Component } from '@angular/core';
import { BarralateralComponent } from "../barralateral/barralateral.component";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Mensagem } from '../../app.config';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-publicacoes',
  imports: [BarralateralComponent,FormsModule,CommonModule],
  templateUrl: './publicacoes.component.html',
  styleUrl: './publicacoes.component.css'
})
export class PublicacoesComponent {

  constructor (private router: Router){}
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
      curtiu: false,
      comentarios: [],
      conectado: true,
    },
    {
      autor: 'Ana Capita',
      conteudo: 'Alguém disponível para colaboração em FP?',
      imagem: '',
      likes: 1,
      curtiu: false,
      comentarios: [],
      conectado: false,
    },

    {
      autor: 'Pedr Cavudissa',
      conteudo: 'Compartilhando um novo projeto incrível,queres participar?!',
      imagem: 'assets/imagens/projeto1.jpg',
      likes: 3,
      comentarios: [],
      conectado: true,
      curtiu: false,
    },
    {
      autor: 'Frederico Jerica',
      conteudo: 'Alguém disponível para colaboração em Projectos com Java?',
      imagem: '',
      likes: 1,
      comentarios: [],
      conectado: false,
      curtiu: false,
    },
  ];


  

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