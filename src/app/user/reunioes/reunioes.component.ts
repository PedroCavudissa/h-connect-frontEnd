import { Component } from '@angular/core';
import { BarralateralComponent } from "../barralateral/barralateral.component";
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { ReunioesService } from '../../reuniao.service';
import { FormsModule } from '@angular/forms';
import { ConexaoService } from '../../services/conexao.service';
import { Usuario } from '../../app.config';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
@Component({
  selector: 'app-reunioes',
  standalone: true,
  imports: [CommonModule, BarralateralComponent, FormsModule],
  templateUrl: './reunioes.component.html',
  styleUrl: './reunioes.component.css'
})
export class ReunioesComponent {
  notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

  usuarioAtualId: number = 0;
  reunioes: any[] = [];
  filtroReunioes = '';
  mostrarFormulario = false;
  conectadosList: Usuario[] = [];
  modoEdicao = false;
  reuniaoEditandoId: number | null = null;

  novaReuniao = {
    titulo: '',
    participantesIds: [] as number[],
    dataHora: '',
    descricao: '',
    link: ''
  };

  constructor(
    private reuniaoService: ReunioesService,
    private conexaoService: ConexaoService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.usuarioAtualId = decoded.sub;
      this.carregarReunioes();
      this.carregarConectados();
   


    }
  }

  carregarConectados() {
    this.conexaoService.getConexoesDoUsuario(this.usuarioAtualId).subscribe((conexoes: any[]) => {
      this.conexaoService.getUsuariosExceto(this.usuarioAtualId).subscribe((usuarios: any[]) => {
        const conectadosList = conexoes
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
        this.conectadosList = conectadosList;
      });
    });
  }
  
  carregarReunioes() {
    this.reuniaoService.listarDoUsuario(this.usuarioAtualId).subscribe((res: any[]) => {
      this.reunioes = res;
    });
  }
  
  agendarReuniao() {
    const dto = {
      titulo: this.novaReuniao.titulo,
      descricao: this.novaReuniao.descricao,
      dataHora: this.novaReuniao.dataHora,
      linkMeet: this.novaReuniao.link,
      criador_id: this.usuarioAtualId,
      participantesIds: this.novaReuniao.participantesIds
    };

    const callback = {
      next: () => {
        this.resetFormulario();
        this.carregarReunioes();
        alert(this.modoEdicao ? 'Reunião atualizada com sucesso!' : 'Reunião agendada com sucesso!');
      },
      error: (err: any) => {
        console.error(err);
        this.notyf.error('Erro ao Editar.');
      }
    };

    if (this.modoEdicao && this.reuniaoEditandoId !== null) {
      this.reuniaoService.editar(this.reuniaoEditandoId, dto).subscribe(callback);
    } else {
      this.reuniaoService.criar(dto).subscribe(callback);
    }
  }

  editarReuniao(reuniao: any) {


    this.novaReuniao = {
      titulo: reuniao.titulo,
      participantesIds: reuniao.participantes.map((p: any) => p.id),
      dataHora: reuniao.dataHora?.slice(0, 16),
      descricao: reuniao.descricao,
      link: reuniao.linkMeet
    };
    console.log('Dados sendo enviados para edição:', this.novaReuniao);
    this.modoEdicao = true;
    this.reuniaoEditandoId = reuniao.id;
    this.mostrarFormulario = true;
  }

  excluirReuniao(id: number) {
    const token = localStorage.getItem('token');
    console.log('Token enviado ao excluir:', token);
    if (confirm('Tem certeza que deseja excluir esta reunião?')) {
      this.reuniaoService.excluir(id).subscribe({
        next: () => {
          this.carregarReunioes();
          alert('Reunião excluída com sucesso!');
        },
        error: err => {
          console.error(err);
          this.notyf.error('Erro ao Eliminar.');
        }
      });
    }
  }

  reunioesFiltradas() {
    const termo = this.filtroReunioes.toLowerCase();
    return this.reunioes.filter(r =>
      r.titulo?.toLowerCase().includes(termo) ||
      r.descricao?.toLowerCase().includes(termo) ||
      r.participantes?.some((p: any) => p.nome.toLowerCase().includes(termo))
    );
  }

  getNomesParticipantes(reuniao: any): string {
    return reuniao.participantes?.map((p: any) => p.nome).join(', ') || '';
  }

  resetFormulario() {
    this.novaReuniao = {
      titulo: '',
      participantesIds: [],
      dataHora: '',
      descricao: '',
      link: ''
    };
    this.mostrarFormulario = false;
    this.modoEdicao = false;
    this.reuniaoEditandoId = null;
  }
}
