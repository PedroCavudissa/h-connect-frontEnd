import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarralateralComponent } from '../barralateral/barralateral.component';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 


interface Projeto {
  id: number;
  nome: string;
  criador: string;
  membros: string[];
}

interface MensagemProjeto {
  projetoId: number;
  autor: string;
  conteudo: string;
  data: Date;
}

@Component({
  selector: 'app-definicoes',
  standalone: true,
  imports: [CommonModule, FormsModule, BarralateralComponent],
  templateUrl: './definicoes.component.html',
  styleUrl: './definicoes.component.css'
})
export class DefinicoesComponent {
   notyf = new Notyf({
    duration: 3000, 
    position: {
      x: 'right',
      y: 'top',     
    },
  });
  menuAberto: string = '';
  mostrarFiltro: boolean = false;

  abrirMenu(menu: string) {
    this.menuAberto = menu;
    this.mostrarFiltro = false;
  }

  filtroMensagens = '';
  filtroProjetos = '';
  filtroConexoes = '';
  filtroConversas = '';
  filtroReunioes = '';

  mensagens = [
    { conteudo: 'Olá', remetente: 'Maria' },
    { conteudo: 'Projeto novo', remetente: 'Carlos' },
    { conteudo: 'Projeto novo', remetente: 'Milson' },
    { conteudo: 'Projeto Terminado', remetente: 'Pedro' }
  ];

  projetos: Projeto[] = [
    { id: 1, nome: 'Sistema X', criador: 'João', membros: ['João', 'Pedro', 'Maria'] },
    { id: 2, nome: 'App Z', criador: 'Ana', membros: ['Ana', 'Carlos'] }
  ];

  mensagensProjeto: MensagemProjeto[] = [];
  projetoSelecionadoId: number | null = null;
  mensagemGrupoTexto = '';

  abrirChatProjeto(projetoId: number) {
    this.projetoSelecionadoId = projetoId;
  }

  get mensagensDoProjetoSelecionado() {
    return this.mensagensProjeto
      .filter(m => m.projetoId === this.projetoSelecionadoId)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }

  enviarMensagemGrupo() {
    if (!this.mensagemGrupoTexto.trim()) return;
    this.mensagensProjeto.push({
      projetoId: this.projetoSelecionadoId!,
      autor: this.usuarioAtual,
      conteudo: this.mensagemGrupoTexto,
      data: new Date()
    });
    this.mensagemGrupoTexto = '';
  }
  editarMensagem(msg: any) {
    this.mensagemTexto = msg.conteudo;
    this.conversaSelecionada = msg.destinatario;
    this.todasMensagens = this.todasMensagens.filter(m => m !== msg);
  }
  
  eliminarMensagem(msg: any) {
    const confirmed = window.confirm('Deseja realmente apagar esta mensagem?');

if (confirmed) {
  this.todasMensagens = this.todasMensagens.filter(m => m !== msg);
  this.notyf.success('Mensagem apagada com sucesso!');
} else {
  this.notyf.error('Ação cancelada!');
}

  }
  

  conexoes = [
    { usuario_id: 1, conectado_id: 2 },
    { usuario_id: 3, conectado_id: 1 }
  ];

  mostrarFormulario = false;

  novaReuniao = {
    titulo: '',
    participantes: '',
    dataHora: '',
    descricao: '',
    link: ''
  };

  reunioes = [
    {
      titulo: 'Reunião Inicial',
      participantes: '1, 2',
      dataHora: new Date().toISOString(),
      descricao: 'Alinhamento do projeto.',
      link: 'https://meet.google.com/abc-defg-hij'
    }
  ];

  agendarReuniao() {
    this.reunioes.push({ ...this.novaReuniao });
    this.novaReuniao = {
      titulo: '',
      participantes: '',
      dataHora: '',
      descricao: '',
      link: ''
    };
    this.mostrarFormulario = false;
  }

  usuarios = [
    { id: 1, nome: 'Carlos' },
    { id: 2, nome: 'Milson' },
    { id: 7, nome: 'Pedro' }
  ];

  getNomeUsuario(id: number): string {
    const usuario = this.usuarios.find(u => u.id === id);
    return usuario ? usuario.nome : 'Desconhecido';
  }

  usuarioLogado = { id: 7, nome: 'Pedro' };
  usuarioAtualId = this.usuarioLogado.id;
  usuarioAtualNome = this.usuarioLogado.nome;
  usuarioAtual = this.usuarioLogado.nome;

  mensagensFiltradas() {
    return this.mensagens.filter(m =>
      m.conteudo.toLowerCase().includes(this.filtroMensagens.toLowerCase()) ||
      m.remetente.toLowerCase().includes(this.filtroMensagens.toLowerCase())
    );
  }

  projetosFiltrados() {
    return this.projetos.filter(p =>
      p.nome.toLowerCase().includes(this.filtroProjetos.toLowerCase()) ||
      p.criador.toLowerCase().includes(this.filtroProjetos.toLowerCase())
    );
  }

  conexoesFiltradas() {
    const termo = this.filtroConexoes.toLowerCase();
  
    return this.conexoes.filter(c => {
      const outroId = c.usuario_id === this.usuarioAtualId ? c.conectado_id : c.usuario_id;
      const outroNome = this.getNomeUsuario(outroId).toLowerCase();
  
      const temConteudoRelacionado = this.todasMensagens.some(m =>
        ((m.remetente === this.usuarioAtual && this.getNomeUsuarioOutro(m.destinatario) === outroNome) ||
         (m.destinatario === this.usuarioAtual && this.getNomeUsuarioOutro(m.remetente) === outroNome)) &&
        m.conteudo.toLowerCase().includes(termo)
      );
  
      return outroNome.includes(termo) || temConteudoRelacionado;
    });
  }
  abrirConversaComConexao(conexao: { usuario_id: number; conectado_id: number }) {
    const outroId = conexao.usuario_id === this.usuarioAtualId ? conexao.conectado_id : conexao.usuario_id;
    const outroNome = this.getNomeUsuario(outroId);
    this.abrirMenu('mensagens'); 
    this.abrirConversa(outroNome); 
  }
  
  

  getNomeUsuarioOutro(nome: string): string { 
    const usuario = this.usuarios.find(u => u.nome === nome);
    return usuario ? usuario.nome : 'Desconhecido';
  }
  

  conversaSelecionada: string | null = null;
  mensagemTexto = '';

  todasMensagens = [
    { remetente: 'Carlos', destinatario: 'Pedro', conteudo: 'Oi Pedro', data: new Date(), lida: false },
    { remetente: 'Pedro', destinatario: 'Carlos', conteudo: 'Oi Carlos', data: new Date(), lida: true },
    { remetente: 'Milson', destinatario: 'Pedro', conteudo: 'Vamos falar?', data: new Date(), lida: false }
  ];

  abrirConversa(usuario: string) {
    this.conversaSelecionada = usuario;
    this.todasMensagens.forEach(m => {
      if (m.remetente === usuario && m.destinatario === this.usuarioAtual) {
        m.lida = true;
      }
    });
  }

  get mensagensDaConversa() {
    return this.todasMensagens.filter(
      m =>
        (m.remetente === this.usuarioAtual && m.destinatario === this.conversaSelecionada) ||
        (m.destinatario === this.usuarioAtual && m.remetente === this.conversaSelecionada)
    ).sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }

  conversasFiltradas() {
    const termo = this.filtroMensagens.toLowerCase();
    const lista: { usuario: string; naoLidas: number }[] = [];
  
    this.todasMensagens.forEach(msg => {
      const outro = msg.remetente === this.usuarioAtual ? msg.destinatario : msg.remetente;
  
      // Verifica se a conversa já foi adicionada
      if (!lista.find(c => c.usuario === outro)) {
        const temConteudoMatch = this.todasMensagens.some(m =>
          ((m.remetente === outro && m.destinatario === this.usuarioAtual) ||
           (m.destinatario === outro && m.remetente === this.usuarioAtual)) &&
          m.conteudo.toLowerCase().includes(termo)
        );
  
        // Adiciona se o nome ou o conteúdo da conversa combinar com o filtro
        if (outro.toLowerCase().includes(termo) || temConteudoMatch) {
          lista.push({
            usuario: outro,
            naoLidas: this.contarNaoLidas(outro)
          });
        }
      }
    });
  
    return lista;
  }
  
  
  contarNaoLidas(usuario: string): number {
    return this.todasMensagens.filter(
      m => m.remetente === usuario && m.destinatario === this.usuarioAtual && !m.lida
    ).length;
  }

  enviarMensagemParaSelecionado() {
    if (!this.mensagemTexto.trim()) return;
    const novaMsg = {
      remetente: this.usuarioAtual,
      destinatario: this.conversaSelecionada!,
      conteudo: this.mensagemTexto,
      data: new Date(),
      lida: false
    };
    this.todasMensagens.push(novaMsg);
    this.mensagemTexto = '';
  }
  reunioesFiltradas() {
    const termo = this.filtroReunioes.toLowerCase();
    return this.reunioes.filter(r =>
      r.titulo.toLowerCase().includes(termo) ||
      r.participantes.toLowerCase().includes(termo) ||
      r.descricao.toLowerCase().includes(termo)
    );
  }
  
}
