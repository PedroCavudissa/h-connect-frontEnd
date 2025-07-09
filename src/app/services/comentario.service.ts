import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CriarComentarioDTO {
  conteudo: string;
  usuarioId: number;
  publicacaoId: number;
}

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  private api = 'http://localhost:3000/comentarios';

  constructor(private http: HttpClient) {}

  criar(dto: CriarComentarioDTO): Observable<any> {
    return this.http.post(this.api, dto);
  }

  listarPorPublicacao(publicacaoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/publicacao/${publicacaoId}`);
  }

  editar(id: number, conteudo: string): Observable<any> {
    return this.http.put(`${this.api}/${id}`, { conteudo });
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
