import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConexaoService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Buscar todos os usuários exceto o logado
  getUsuariosExceto(idAtual: number) {
    return this.http.get(`${this.apiUrl}/usuarios/outros/${idAtual}`);
  }

  // Buscar conexões do usuário
  getConexoesDoUsuario(userId: number) {
    return this.http.get(`${this.apiUrl}/conexoes/${userId}`);
  }

  // Enviar novo pedido de conexão
  enviarPedido(de: number, para: number) {
    return this.http.post(`${this.apiUrl}/conexoes`, {
      usuario_id: de,
      conectado_id: para,
    });
  }

  // Atualizar status de uma conexão
  atualizarStatus(id: number, status: string) {
    return this.http.patch(`${this.apiUrl}/conexoes/${id}`, { status });
  }

  // Remover uma conexão
  removerConexao(id: number) {
    return this.http.delete(`${this.apiUrl}/conexoes/${id}`);
  }

  aceitar(id: number) {
    return this.http.patch(`${this.apiUrl}/conexoes/${id}/aceitar`, {});
  }
  
  rejeitar(id: number) {
    return this.http.patch(`${this.apiUrl}/conexoes/${id}/rejeitar`, {});
  }
  
}
