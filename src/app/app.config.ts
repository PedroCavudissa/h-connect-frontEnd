import { ApplicationConfig, NgModule, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {  HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimations(),   
    provideToastr(),
    importProvidersFrom(HttpClientModule) 
  ]
};


export interface Projeto {
  id?: number;
  nome: string;
  descricao: string;
  participantes: [];
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


