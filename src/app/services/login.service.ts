import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) {}

  entrar(credentials: { email: string; senha: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token); 
          console.log('token', res.token);
        }
      })
    );
  }
  
  recuperarSenha(){}
}
