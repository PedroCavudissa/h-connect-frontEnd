import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarralateralComponent } from '../barralateral/barralateral.component';
import { CriarPublicacaoDto, PublicacaoService } from '../../services/publicacao.service';
import { CurtidaService } from '../../services/curtidas.service';
import { ComentarioService } from '../../services/comentario.service';
import { Publicacao } from '../../app.config';
import { ConexaoService } from '../../services/conexao.service';

@Component({
  selector: 'app-telausuarios',
  standalone: true,
  imports: [BarralateralComponent, CommonModule, FormsModule],
  templateUrl: './telausuarios.component.html',
  styleUrl: './telausuarios.component.css',
})
export class TelausuariosComponent implements OnInit {
  notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

  publicacoes: any[] = [];
  conexoes: any[] = [];
  novaPublicacao: string = '';
  usuarioAtualId: number = 0;
  novoConectadoId: number | null = null;
  conectados: number[] = [];
  modalUsuarioAberto = false;
usuarioSelecionado: any = null;


  
  constructor(
    private router: Router,
    private publicacaoService: PublicacaoService,
    private curtidaService: CurtidaService,
    private comentarioService: ComentarioService,
    private conexaoService: ConexaoService
  ) {}

  ngOnInit(): void {
    const payload = this.decodeToken();
    if (payload?.sub) {
      this.usuarioAtualId = +payload.sub;
      this.carregarPublicacoes();
      this.carregarConexoes();
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  decodeToken(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  carregarPublicacoes(): void {
    this.publicacaoService.listarRecentes().subscribe({
      next: (res: any[]) => {
        this.publicacoes = res;
  
        for (let post of this.publicacoes) {
          this.curtidaService.statusCurtida(post.id, this.usuarioAtualId).subscribe({
            next: (status) => {
              post.likes = status.total;
              post.curtido = status.curtiu;
            }
          });
  
          // Carrega os comentários de forma explícita
          this.comentarioService.listarPorPublicacao(post.id).subscribe({
            next: (comentarios) => {
              post.comentarios = comentarios;
            },
            error: () => {
              post.comentarios = [];
            }
          });
        }
      },
      error: (err) => {
        console.error('Erro ao carregar publicações', err);
      }
    });
  }
  
  

 
publicar(): void {
  const conteudo = this.novaPublicacao.trim();
  if (!conteudo) return;

  const dto: CriarPublicacaoDto = {
    conteudo,
    usuarioId: this.usuarioAtualId,
  };

  this.publicacaoService.criar(dto).subscribe({
    next: () => {
      this.novaPublicacao = '';
      this.notyf.success('Publicação feita com sucesso!');
      this.carregarPublicacoes();
    },
    error: () => this.notyf.error('Erro ao publicar'),
  });
}

comentarPost(publicacaoId: number, input: HTMLInputElement): void {
  const conteudo = input.value.trim();
  if (!conteudo) return;

  this.comentarioService.criar({
    conteudo,
    usuarioId: this.usuarioAtualId,
    publicacaoId
  }).subscribe({
    next: () => {
      this.notyf.success('Comentário adicionado!');
      input.value = '';

      const post = this.publicacoes.find(p => p.id === publicacaoId);
      if (post) {
        this.comentarioService.listarPorPublicacao(publicacaoId).subscribe({
          next: (comentarios) => {
            post.comentarios = comentarios;
          },
          error: () => {
            this.notyf.error('Erro ao atualizar comentários');
            post.comentarios = [];
          }
        });
      }
    },
    error: () => {
      this.notyf.error('Erro ao comentar');
    }
  });
}

abrirModalComentarios(post: any): void {
  this.comentarioService.listarPorPublicacao(post.id).subscribe({
    next: (comentarios) => {
      post.comentarios = comentarios;
      post.mostrarModal = true;
    },
    error: () => {
      post.comentarios = [];
      post.mostrarModal = true;
      this.notyf.error('Erro ao carregar comentários');
    }
  });
}



  editarComentario(comentario: any) {
    this.comentarioService.editar(comentario.id, comentario.conteudo).subscribe({
      next: () => {
        this.notyf.success('Comentário editado!');
        comentario.editando = false;
      },
      error: () => this.notyf.error('Erro ao editar comentário'),
    });
  }

  excluirComentario(id: number) {
    if (confirm('Tem certeza que deseja excluir este comentário?')) {
      this.comentarioService.remover(id).subscribe({
        next: () => {
          this.notyf.success('Comentário removido!');
          this.carregarPublicacoes();
        },
        error: () => this.notyf.error('Erro ao remover comentário'),
      });
    }
  }

  verMais(): void {
    this.router.navigate(['/publicacoes']);
  }

  verDetalhes(nome: string): void {
    const rotas: any = {
      Projetos: '/projecto',
      Publicações: '/publicacoes',
      Mensagens: '/mensagens',
      Conexões: '/conexoes',
    };
    this.router.navigate([rotas[nome] || '/']);
  }

 

  alternarCurtida(post: any): void {
    const foiCurtido = post.curtido;
  
    if (foiCurtido) {
      this.curtidaService.descurtir(this.usuarioAtualId, post.id).subscribe({
        next: () => {
          post.curtido = false;
          post.likes = (post.likes || 1) - 1;
        },
        error: () => this.notyf.error('Erro ao remover curtida'),
      });
    } else {
      this.curtidaService.curtir(this.usuarioAtualId, post.id).subscribe({
        next: () => {
          post.curtido = true;
          post.likes = (post.likes || 0) + 1;
        },
        error: () => this.notyf.error('Erro ao curtir'),
      });
    }
  }

  curtirPost(post: any): void {
    if (post.curtido) {
      this.curtidaService.descurtir(this.usuarioAtualId, post.id).subscribe({
        next: () => {
          post.curtido = false;
          post.likes--;
        },
        error: () => this.notyf.error('Erro ao remover curtida'),
      });
    } else {
      this.curtidaService.curtir(this.usuarioAtualId, post.id).subscribe({
        next: () => {
          post.curtido = true;
          post.likes++;
        },
        error: () => this.notyf.error('Erro ao curtir'),
      });
    }
  }
  

  //Conexão
  conectarCom(destinatarioId: number): void {
    if (!destinatarioId) return;
  
    this.conexaoService.enviarPedido(this.usuarioAtualId, destinatarioId).subscribe({
      next: () => {
        this.carregarConexoes();
        this.notyf.success("Pedido Enviado!");
      },
      error: (err) => {
        console.error('Erro ao enviar pedido:', err);
        this.notyf.error("Erro ao enviar pedido!");
      }
    });
  }
  
  carregarConexoes(): void {
    this.conexaoService.getConexoesDoUsuario(this.usuarioAtualId).subscribe({
      next: (res: any[]) => {
        this.conexoes = res;
      },
      error: err => {
        console.error('Erro ao carregar conexões:', err);
      }
    });
  }
  
  
  podeConectarCom(id: number): boolean {
    if (id === this.usuarioAtualId) return false;
  
    const conexaoExistente = this.conexoes.find(c =>
      (c.usuario_id === this.usuarioAtualId && c.conectado_id === id) ||
      (c.conectado_id === this.usuarioAtualId && c.usuario_id === id)
    );
  
    // Se já existe conexão aceita ou pendente, não pode conectar
    return !conexaoExistente;
  }
  
  verificarStatusConexao(id: number): 'nenhuma' | 'pendente' | 'aceito' {
    const conexao = this.conexoes.find(c =>
      (c.usuario.id === this.usuarioAtualId && c.conectado.id === id) ||
      (c.conectado.id === this.usuarioAtualId && c.usuario.id === id)
    );
  
    if (!conexao) return 'nenhuma';
  
    return conexao.status === 'aceito' ? 'aceito' : 'pendente';
  }
  
  alertaPendente(): void {
    this.notyf.error('Você já enviou um pedido de conexão para este usuário.');
  }
  
  abrirModalUsuario(usuario: any): void {
    this.usuarioSelecionado = usuario;
    this.modalUsuarioAberto = true;
  }
  
  fecharModalUsuario(): void {
    this.modalUsuarioAberto = false;
    this.usuarioSelecionado = null;
  }
  
}
