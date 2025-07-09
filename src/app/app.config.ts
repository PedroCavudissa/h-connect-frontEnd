import { ApplicationConfig, NgModule, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {  HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AuthInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimations(),   
    provideToastr(),
    importProvidersFrom(HttpClientModule),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};




export interface Projeto {
  id?: number;
  nome: string;
  descricao: string;
  id_criador: number;
  participantes:Usuario [];
  dataCriacao: string; // formato: 'YYYY-MM-DD'
  status: string;
}

 export interface Usuario {
  id: number;
  nome: string;
}

export interface Conexao {
  id: number;
  usuario_id: number;
  conectado_id: number;
  status: 'pendente' | 'aceito' | 'rejeitado';
  dataSolicitacao: Date;
}


export interface Mensagem {
  id?: number;
  remetente:string;
  destinatario: string;
  conteudo: string;
  data: Date;
 
}
export interface Publicacao {
  id: number;
  conteudo: string;
  dataCriacao: string;
  usuario: {
    id: number;
    nome: string;
  };
  comentarios: any[];
  likes: number;
}

export interface Usuario {
  id: number;
  nome: string;
  email?: string;
}

export interface Comentario {
  id: number;
  conteudo: string;
  usuario: Usuario;
  editando?: boolean;
}


