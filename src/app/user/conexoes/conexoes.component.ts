import { Component, OnInit } from '@angular/core';
import { ConexaoService } from '../../services/conexao.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarralateralComponent } from '../barralateral/barralateral.component';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
@Component({
  selector: 'app-conexoes',
  standalone: true,
  imports:[CommonModule,FormsModule,BarralateralComponent],
  templateUrl: './conexoes.component.html',
  styleUrls: ['./conexoes.component.css'],
})
export class ConexoesComponent implements OnInit {
  notyf = new Notyf({
    duration: 3000, 
    position: {
      x: 'right',
      y: 'top',     
    },
  });
  usuarioAtualId = 0;
  usuarios: any[] = [];
  conexoes: any[] = [];
  novoConectadoId: number | null = null;

  constructor(private conexaoService: ConexaoService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.usuarioAtualId = decoded.sub;

      this.carregarUsuarios();
      this.carregarConexoes();
    }
  }

  carregarUsuarios() {
    this.conexaoService.getUsuariosExceto(this.usuarioAtualId).subscribe(res => {
      this.usuarios = res as any[];
    });
  }

  carregarConexoes() {
    this.conexaoService.getConexoesDoUsuario(this.usuarioAtualId).subscribe(res => {
      this.conexoes = res as any[];
    });
  }

  get conexoesPendentes() {
    return this.conexoes.filter(c => c.status === 'pendente' && c.conectado_id === this.usuarioAtualId);
  }

  get conexoesAceitas() {
    return this.conexoes.filter(c =>
      c.status === 'aceito' && (c.usuario_id === this.usuarioAtualId || c.conectado_id === this.usuarioAtualId)
    );
  }

  getNomeUsuario(id: number): string {
    const user = this.usuarios.find(u => u.id === id);
    return user ? user.nome : 'Desconhecido';
  }

  aceitarConexao(id: number) {
    console.log('Aceitando conexão:', id);
    this.conexaoService.aceitar(id).subscribe(() => {
      this.carregarConexoes();
      this.notyf.success('Conexão aceita!');
    });
  }
  
  rejeitarConexao(id: number) {
    console.log('Rejeitando conexão:', id);
    this.conexaoService.rejeitar(id).subscribe(() => {
      this.carregarConexoes();
      this.notyf.success('Conexão rejeitada!');
    });
  }
  
  enviarPedido() {
    console.log('Tentando enviar pedido para:', this.novoConectadoId);
    if (!this.novoConectadoId) return;
    
    this.conexaoService.enviarPedido(this.usuarioAtualId, this.novoConectadoId)
      .subscribe({
        next: () => {
          console.log('Pedido enviado com sucesso!');
          this.carregarConexoes();
          this.novoConectadoId = null;
          this.notyf.success("Pedido Enviado!");
        },
        error: (err) => {
          console.error('Erro ao enviar pedido:', err);
          this.notyf.error("Erro ao enviar pedido!");
        }
      });
  }
  

  excluirConexao(id: number) {
    if (confirm("Deseja realmente eliminar esta conexão?")) {
      this.conexaoService.removerConexao(id).subscribe(() => {
        this.carregarConexoes();
      });
    }
  }
}
