import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Projeto } from '../../app.config';
import { BarralateralComponent } from '../barralateral/barralateral.component';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

@Component({
  standalone: true,
  selector: 'app-projetos',
  templateUrl: './projecto.component.html',
  styleUrl: './projecto.component.css',
  imports: [CommonModule, FormsModule, BarralateralComponent],
})
export class ProjetosComponent {
  notyf = new Notyf({
    duration: 3000,
    position: {
      x: 'right',
      y: 'top',
    },
  });

  projetos: Projeto[] = [];

  editando: boolean = false;

  projetoAtual: Projeto = this.novoProjeto();

  listaPessoas: string[] = ['João', 'Ana', 'Luís'];

  novoProjeto(): Projeto {
    return {
      id: undefined,
      nome: '',
      descricao: '',
      participantes: [],
      dataCriacao: new Date().toISOString().substring(0, 10),
      status: ''
    };
  }

  salvarProjeto(): void {
    if (this.editando) {
      const index = this.projetos.findIndex((p) => p.id === this.projetoAtual.id);
      if (index !== -1) {
        this.projetos[index] = { ...this.projetoAtual };
        this.notyf.success('Projeto atualizado com sucesso!');
      }
    } else {
      const novoId = this.projetos.length + 1;
      this.projetos.push({ ...this.projetoAtual, id: novoId });
      this.notyf.success('Projeto adicionado com sucesso!');
    }

    this.cancelar();
  }

  editarProjeto(p: Projeto): void {
    this.projetoAtual = { ...p };
    this.editando = true;
  }

  excluirProjeto(id: number): void {
    if (confirm("Tem certeza que deseja eliminar o Projeto?")) {
      this.projetos = this.projetos.filter((p) => p.id !== id);
      this.notyf.success('Projeto eliminado com sucesso!');
    }
  }

  cancelar(): void {
    this.projetoAtual = this.novoProjeto();
    this.editando = false;
  }
}
