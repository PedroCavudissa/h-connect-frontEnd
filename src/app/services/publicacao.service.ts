import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publicacao } from '../app.config';


export interface CriarPublicacaoDto {
  conteudo: string;
  imagem?: string;
  usuarioId: number;
}
export interface CurtirPublicacaoDto {
  usuarioId: number;
}
export interface DescurtirPublicacaoDto {
  usuarioId: number;
}
export interface ComentarPublicacaoDto {
  autorId: number;
  texto: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicacaoService {
  private api = 'http://localhost:3000/publicacao';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Publicacao[]> {
    return this.http.get<Publicacao[]>(this.api);
  }

  listarRecentes(): Observable<Publicacao[]> {
    return this.http.get<Publicacao[]>(`${this.api}/recentes`);
  }

  criar(dto: CriarPublicacaoDto): Observable<any> {
    return this.http.post(this.api, dto);
  }

  curtir(publicacaoId: number, usuarioId: number): Observable<any> {
    return this.http.patch(`${this.api}/${publicacaoId}/curtir`, { usuarioId });
  }

  descurtir(publicacaoId: number, usuarioId: number): Observable<any> {
    return this.http.patch(`${this.api}/${publicacaoId}/descurtir`, { usuarioId });
  }

  comentar(publicacaoId: number, autorId: number, texto: string): Observable<any> {
    return this.http.post(`${this.api}/${publicacaoId}/comentarios`, { autorId, texto });
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }

  editar(id: number, dto: any): Observable<any> {
    return this.http.put(`${this.api}/${id}`, dto);
  }

  statusCurtida(publicacaoId: number, usuarioId: number) {
    return this.http.get<{ total: number; curtiu: boolean }>(
      `${this.api}/status/${publicacaoId}/${usuarioId}`
    );
  }
}
