import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../app.config';

@Injectable({ providedIn: 'root' })
export class ConexaoService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUsuariosExceto(idAtual: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/outros/${idAtual}`);
  }

  getConexoesAceitas(idAtual: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conexoes/aceitas/${idAtual}`);
  }
  getConexoesDoUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conexoes/${usuarioId}`);
  }

  aceitar(id: number) {
    return this.http.patch(`${this.apiUrl}/conexoes/${id}/aceitar`, {});
  }
  

  rejeitar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/conexoes/${id}/rejeitar/`, {});
  }

  enviarPedido(usuario_id: number, conectado_id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/conexoes`, { usuario_id, conectado_id });
  }  

  removerConexao(id: number) {
    return this.http.delete(`${this.apiUrl}/conexoes/${id}`);
  }
  

  listarRelacoes(id: number): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/conexoes/${id}`);
  }
  
  
}
