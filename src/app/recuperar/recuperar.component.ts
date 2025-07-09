import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent {
  recuperarForm: FormGroup;
  @Output() fechar = new EventEmitter<void>();
  @Output() voltarLogin = new EventEmitter<void>();
  notyf = new Notyf();

  constructor(private fb: FormBuilder) {
    this.recuperarForm = this.fb.group({
      gmail: ['', [Validators.required, Validators.email]],
     
    });
  }

  alterarSenha() {
    if (this.recuperarForm.invalid) {
      this.notyf.error('Preencha todos o campo corretamente!');
      return;
    }

    const { gmail, senha } = this.recuperarForm.value;
    console.log('Simulando envio para:', gmail, 'Nova senha:', senha);
    this.notyf.success('E-mail de recuperação enviado com sucesso!');
    this.recuperarForm.reset();
    this.fechar.emit();
  }
}
