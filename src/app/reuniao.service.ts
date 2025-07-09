import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReunioesService {
  private api = 'http://localhost:3000/reunioes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  criar(reuniao: any): Observable<any> {
    return this.http.post(this.api, reuniao, this.getAuthHeaders());
  }

  listarDoUsuario(usuarioId: number) {
    return this.http.get<any[]>(`${this.api}/${usuarioId}`, this.getAuthHeaders());
  }

  editar(id: number, data: any): Observable<any> {
    
    const dadosFiltrados = { ...data };
    delete dadosFiltrados.criador;
    delete dadosFiltrados.criador_id;
    return this.http.patch(`${this.api}/${id}`, dadosFiltrados, this.getAuthHeaders());
  }
  

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`, this.getAuthHeaders());
  }
}
