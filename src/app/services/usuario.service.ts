import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  buscarPorId(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  atualizarUsuario(id: number, dados: any) {
    return this.http.patch(`${this.apiUrl}/${id}`, dados);
  }

  alterarSenha(id: number, senha: string) {
    return this.http.patch(`${this.apiUrl}/${id}/senha`, { senha });
  }
}
