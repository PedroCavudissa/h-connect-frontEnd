import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Projeto } from '../../app.config';
import { BarralateralComponent } from '../barralateral/barralateral.component';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { ConexaoService } from '../../services/conexao.service';
import { jwtDecode } from 'jwt-decode';
import { ProjectoService } from '../../services/projecto.service';

@Component({
  standalone: true,
  selector: 'app-projeto',
  templateUrl: './projecto.component.html',
  styleUrls: ['./projecto.component.css'],
  imports: [CommonModule, FormsModule, BarralateralComponent],
})
export class ProjetosComponent implements OnInit {
  notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

  projetos: Projeto[] = [];
  editando = false;
  mostrarModal = false;

  projetoAtual!: Projeto;
  usuarioAtualId = 0;
  usuarios: any[] = [];
  conexoes: any[] = [];
  conectadosList: any[] = [];

  constructor(
    private conexaoService: ConexaoService,
    private projectoService: ProjectoService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.usuarioAtualId = decoded.sub;

      this.projetoAtual = this.novoProjeto();
      this.carregarConectados();
      this.carregarProjetos();
    }
  }

  carregarConectados(): void {
    this.conexaoService.getConexoesDoUsuario(this.usuarioAtualId).subscribe((conexoes: any[]) => {
      this.conexaoService.getUsuariosExceto(this.usuarioAtualId).subscribe((usuarios: any[]) => {
        const conectados = conexoes
          .filter(c =>
            c.status === 'aceito' &&
            (c.usuario.id === this.usuarioAtualId || c.conectado.id === this.usuarioAtualId)
          )
          .map(c =>
            c.usuario.id === this.usuarioAtualId
              ? usuarios.find(u => u.id === c.conectado.id)
              : usuarios.find(u => u.id === c.usuario.id)
          )
          .filter(Boolean);
        this.conectadosList = conectados;
      });
    });
  }

  novoProjeto(): Projeto {
    return {
      id: undefined,
      nome: '',
      descricao: '',
      id_criador: this.usuarioAtualId,
      participantes: [],
      dataCriacao: new Date().toISOString().substring(0, 10),
      status: 'Em andamento'
    };
  }

  carregarProjetos(): void {
    this.projectoService.getProjetosPorUsuario(this.usuarioAtualId).subscribe({
      next: (res: Projeto[]) => this.projetos = res,
      error: () => this.notyf.error('Erro ao carregar os projetos!')
    });
  }

  salvarProjeto(): void {
    if (this.editando) {
      this.projectoService.atualizarProjeto(this.projetoAtual.id!, this.projetoAtual).subscribe({
        next: () => {
          const index = this.projetos.findIndex(p => p.id === this.projetoAtual.id);
          if (index !== -1) this.projetos[index] = { ...this.projetoAtual };
          this.notyf.success('Projeto atualizado com sucesso!');
          this.cancelar();
        },
        error: () => this.notyf.error('Erro ao atualizar projeto!')
      });
    } else {
      const novoProjeto = {
        nome: this.projetoAtual.nome,
        descricao: this.projetoAtual.descricao,
        id_criador: this.usuarioAtualId,
        participantes: this.projetoAtual.participantes,
        dataCriacao: this.projetoAtual.dataCriacao,
        status: this.projetoAtual.status
      };

      this.projectoService.salvarProjeto(novoProjeto).subscribe({
        next: (res: any) => {
          this.projetos.push(res);
          this.notyf.success('Projeto criado com sucesso!');
          this.cancelar();
        },
        error: () => this.notyf.error('Erro ao criar projeto!')
      });
    }
  }

  editarProjeto(p: Projeto): void {
    if (p.id_criador !== this.usuarioAtualId) {
      this.notyf.error('Você não tem permissão para editar este projeto');
      return;
    }
    this.projetoAtual = { ...p };
    this.editando = true;
    this.mostrarModal = true;
  }

  excluirProjeto(id: number): void {
    const projeto = this.projetos.find(p => p.id === id);
    if (!projeto || projeto.id_criador !== this.usuarioAtualId) {
      this.notyf.error('Você não tem permissão para eliminar este projeto');
      return;
    }

    if (confirm('Tem certeza que deseja eliminar o Projeto?')) {
      this.projectoService.excluirProjeto(id).subscribe({
        next: () => {
          this.projetos = this.projetos.filter(p => p.id !== id);
          this.notyf.success('Projeto eliminado com sucesso!');
        },
        error: () => this.notyf.error('Erro ao eliminar o projeto!')
      });
    }
  }

  abrirFormulario(): void {
    this.projetoAtual = this.novoProjeto();
    this.editando = false;
    this.mostrarModal = true;
  }

  cancelar(): void {
    this.projetoAtual = this.novoProjeto();
    this.editando = false;
    this.mostrarModal = false;
  }

  fecharModal(): void {
    this.cancelar();
  }

  getNomeUsuario(id: number): string {
    const user = this.usuarios.find(u => u.id === id);
    return user ? user.nome : 'Desconhecido';
  }
  filtroProjetos: string = '';

  projetosFiltrados(): Projeto[] {
    const filtro = this.filtroProjetos.toLowerCase();
  
    return this.projetos.filter(p =>
      p.nome.toLowerCase().includes(filtro) ||
      p.status.toLowerCase().includes(filtro) ||
      p.participantes
        .map(participante => participante.nome)
        .some(nome => nome.toLowerCase().includes(filtro))
    );
  }
  

}
