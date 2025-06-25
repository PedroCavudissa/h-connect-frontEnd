import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarralateralComponent } from "../barralateral/barralateral.component";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 



interface Mensagem {
  id: number;
  remetente: string;
  destinatario: string;
  conteudo: string;
  data: Date;
}

@Component({
  selector: 'app-mensagens',
  standalone: true,
  imports: [CommonModule, FormsModule, BarralateralComponent],
  templateUrl: './mensagens.component.html',
  styleUrls: ['./mensagens.component.css']
})
export class MensagensComponent {
  notyf = new Notyf({
    duration: 3000, 
    position: {
      x: 'right',
      y: 'top',     
    },
  });
  usuarioAtual = 'Maria';

  mensagemRespondidaId: number | null = null;
  editandoId: number | null = null;
  mensagens: Mensagem[] = [
    {
      id: 1,
      remetente: 'João',
      destinatario: 'Maria',
      conteudo: 'Olá, tudo bem?',
      data: new Date('2025-05-01T14:30:00')
    }
  ];

  novaMensagem = {
    remetente: '',
    destinatario: '',
    conteudo: ''
  };

 

  enviarMensagem() {
    this.novaMensagem.remetente = this.usuarioAtual;
  
    if (
      this.novaMensagem.remetente &&
      this.novaMensagem.destinatario &&
      this.novaMensagem.conteudo
    ) {
      if (this.editandoId) {
        const index = this.mensagens.findIndex(m => m.id === this.editandoId);
        if (index !== -1) {
          this.mensagens[index] = {
            ...this.novaMensagem,
            id: this.editandoId,
            data: new Date()
          };
        }
        this.editandoId = null;
        this.notyf.success("Mensagem editada com sucesso!");
      } else {
        const novaId = this.mensagens.length ? Math.max(...this.mensagens.map(m => m.id)) + 1 : 1;
        this.mensagens.push({
          ...this.novaMensagem,
          id: novaId,
          data: new Date()
        });
  
        //  Se for resposta, apaga a original recebida
        if (this.mensagemRespondidaId !== null) {
          this.mensagens = this.mensagens.filter(m => m.id !== this.mensagemRespondidaId);
          this.mensagemRespondidaId = null;
        }
  
        this.notyf.success("Mensagem enviada com sucesso!");
      }
  
      this.novaMensagem = { remetente: '', destinatario: '', conteudo: '' };
    } else {
      this.notyf.success('Preencha todos os campos!');
    }
  }
  

  responder(remetente: string, idOriginal: number) {
    this.novaMensagem.destinatario = remetente;
    this.novaMensagem.remetente = this.usuarioAtual;
    this.mensagemRespondidaId = idOriginal; // armazena para apagar depois
  }
  
  

  editarMensagem(mensagem: Mensagem) {
    this.novaMensagem = {
      remetente: mensagem.remetente,
      destinatario: mensagem.destinatario,
      conteudo: mensagem.conteudo
    };
    this.editandoId = mensagem.id;
  }

  eliminar(id: number) {
    if (confirm("Tem certeza que deseja eliminar a mensagem?")) {
      this.mensagens = this.mensagens.filter(m => m.id !== id);
     this. notyf.success('Mensagem eliminada com sucesso!');
      window.location.reload();
    }
  }
  get mensagensEnviadas(): Mensagem[] {
    return this.mensagens.filter(m => m.remetente === this.usuarioAtual);
  }
  
  get mensagensRecebidas(): Mensagem[] {
    return this.mensagens.filter(m => m.destinatario === this.usuarioAtual);
  }
  

}
