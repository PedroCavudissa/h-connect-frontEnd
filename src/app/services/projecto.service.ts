import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projeto } from '../app.config'; 

@Injectable({
  providedIn: 'root',
})
export class ProjectoService {
  private apiUrl = 'http://localhost:3000/projectos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProjetosPorUsuario(usuarioId: number): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.apiUrl}/${usuarioId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  salvarProjeto(projeto: any): Observable<Projeto> {
    return this.http.post<Projeto>(`${this.apiUrl}`, projeto, {
      headers: this.getAuthHeaders(),
    });
  }

  atualizarProjeto(id: number, projeto: any): Observable<Projeto> {
    return this.http.put<Projeto>(`${this.apiUrl}/${id}`, projeto, {
      headers: this.getAuthHeaders(),
    });
  }

  excluirProjeto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  listarTodos(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.apiUrl}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
