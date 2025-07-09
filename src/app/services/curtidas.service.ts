import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CurtidaService {
  private apiUrl = 'http://localhost:3000/curtidas';

  constructor(private http: HttpClient) {}

  curtir(usuarioId: number, publicacaoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { usuarioId, publicacaoId });
  }

  descurtir(usuarioId: number, publicacaoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${usuarioId}/${publicacaoId}`);
  }
  

  jaCurtiu(usuarioId: number, publicacaoId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verificar`, {
      params: {
        usuarioId: usuarioId.toString(),
        publicacaoId: publicacaoId.toString(),
      },
    });
  }

  listarCurtidasDoUsuario(usuarioId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  statusCurtida(publicacaoId: number, usuarioId: number) {
    return this.http.get<{ total: number; curtiu: boolean }>(
      `${this.apiUrl}/status/${publicacaoId}/${usuarioId}`
    );
  }
}
