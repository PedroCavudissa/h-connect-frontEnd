import { Component, OnInit } from '@angular/core';
import { ConexaoService } from '../../services/conexao.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarralateralComponent } from '../barralateral/barralateral.component';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 
import { FilterByNomePipe } from '../../filter-by-nome.pipe';

@Component({
  selector: 'app-conexoes',
  standalone: true,
  imports: [CommonModule, FormsModule, BarralateralComponent, FilterByNomePipe],
  templateUrl: './conexoes.component.html',
  styleUrls: ['./conexoes.component.css'],
})
export class ConexoesComponent implements OnInit {
  notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' }
  });

  filtroNome = '';
  usuarioAtualId = 0;
  modalPendentesAberto = false;
  modalEnviadosAberto = false;

  usuarios: any[] = [];
  conexoes: any[] = [];

  conexoesPendentesList: any[] = [];
  conexoesAceitasList: any[] = [];
  pedidosEnviadosList: any[] = [];
  conectadosList: any[] = [];

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
      console.log('Usuários carregados:', this.usuarios); // <--
      this.atualizarListas();
    });
  }
  

  carregarConexoes() {
    this.conexaoService.getConexoesDoUsuario(this.usuarioAtualId).subscribe({
      next: (res: any[]) => {
        this.conexoes = res;
        console.log('Conexões carregadas:', this.conexoes); 
        this.atualizarListas();
      },
      error: (err) => console.error('Erro ao carregar conexões:', err)
    });
  }
  

  atualizarListas() {
    this.conexoesPendentesList = this.conexoes.filter(
      c => c.status === 'pendente' && c.conectado.id === this.usuarioAtualId
    );
  
    this.pedidosEnviadosList = this.conexoes
      .filter(c => c.status === 'pendente' && c.usuario.id === this.usuarioAtualId)
      .map(c => {
        const user = this.usuarios.find(u => u.id === c.conectado.id);
        return user ? { id: c.id, nome: user.nome } : null;
      })
      .filter(Boolean);
  
    this.conexoesAceitasList = this.conexoes.filter(
      c => c.status === 'aceito' &&
      (c.usuario.id === this.usuarioAtualId || c.conectado.id === this.usuarioAtualId)
    );
  
    this.conectadosList = this.conexoesAceitasList.map(c =>
      c.usuario.id === this.usuarioAtualId
        ? this.usuarios.find(u => u.id === c.conectado.id)
        : this.usuarios.find(u => u.id === c.usuario.id)
    ).filter(Boolean);
  }
  

  getNomeUsuario(id: number): string {
    const user = this.usuarios.find(u => u.id === id);
    return user ? user.nome : 'Desconhecido';
  }
  

  usuariosFiltrados(): any[] {
    return this.usuarios.filter(u =>
      u.id !== this.usuarioAtualId &&
      !this.conexoes.some(c =>
        (c.usuario_id === this.usuarioAtualId && c.conectado_id === u.id) ||
        (c.conectado_id === this.usuarioAtualId && c.usuario_id === u.id)
      )
    );
  }

  aceitarConexao(id: number) {
    console.log("Aceitar conexão:", id); 
    this.conexaoService.aceitar(id).subscribe(() => {
      this.carregarConexoes();
      this.notyf.success('Conexão aceita!');
    });
  }
  

  rejeitarConexao(id: number) {
    this.conexaoService.rejeitar(id).subscribe(() => {
      this.carregarConexoes();
      this.notyf.success('Conexão rejeitada!');
    });
  }

  enviarPedido() {
    if (!this.novoConectadoId) return;

    this.conexaoService.enviarPedido(this.usuarioAtualId, this.novoConectadoId).subscribe({
      next: () => {
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
        this.notyf.success('Conexão removida com sucesso!');
        this.carregarConexoes();
       
      });
    }
  }
  

  abrirModalPendentes() {
    this.modalPendentesAberto = true;
  }

  fecharModalPendentes() {
    this.modalPendentesAberto = false;
  }

  abrirModalEnviados() {
    this.modalEnviadosAberto = true;
  }

  fecharModalEnviados() {
    this.modalEnviadosAberto = false;
  }
}
