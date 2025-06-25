import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  entrar(credentials: { email: string; senha: string }) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
  recuperarSenha(){}
}
