import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode'; 
import { Notyf } from 'notyf';

import { BarralateralComponent } from '../barralateral/barralateral.component';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, BarralateralComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent implements OnInit {
  notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

  editando = false;
  mostrarModal = false;
  userId!: number;

  perfil = {
    nome: '',
    email: '',
    area: '',
    instituicao: '',
    dataCadastro: '',
    tipoUsuario: '',
  };

  senhaAtual = '';
  novaSenha = '';
  confSenha = '';

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);  
      this.userId = decoded.sub;

      this.usuarioService.buscarPorId(this.userId).subscribe((dados: any) => {
        this.perfil = {
          nome: dados.nome,
          email: dados.email,
          area: dados.areaFormacao,
          instituicao: dados.instituicao,
          dataCadastro: dados.dataCadastro?.substring(0, 10),
          tipoUsuario: dados.role_id === 2 ? 'Estudante' : 'Outro',
        };
      });
    }
  }

  habilitarEdicao(): void {
    this.editando = true;
  }

  salvar(): void {
    this.usuarioService.atualizarUsuario(this.userId, {
      nome: this.perfil.nome,
      email: this.perfil.email,
      areaFormacao: this.perfil.area,
      instituicao: this.perfil.instituicao,
    }).subscribe(() => {
      this.notyf.success('Perfil atualizado com sucesso!');
      this.editando = false;
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }

  salvarSenha(): void {
    if (this.novaSenha !== this.confSenha) {
      this.notyf.error('As senhas não coincidem!');
      return;
    }

    this.usuarioService.alterarSenha(this.userId, this.novaSenha).subscribe(() => {
      this.notyf.success('Senha alterada com sucesso!');
      this.fecharModal();
      this.novaSenha = '';
      this.confSenha = '';
      this.senhaAtual = '';
    });
  }
}
