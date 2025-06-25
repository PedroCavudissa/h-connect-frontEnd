import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Notyf } from 'notyf';
import { Router } from '@angular/router';
import { CadastroService} from '../services/cadastro.service';

const notyf = new Notyf({
  duration: 3000, 
  position: {
    x: 'right',
    y: 'top',     
  },
});

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls:['./cadastro.component.css']
})
export class CadastroComponent {
  cadastroForm: FormGroup;
today= new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
constructor(
  private fb: FormBuilder,
  private router: Router,
  private cadastroService: CadastroService
) {
  this.cadastroForm = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    areaFormacao: ['', Validators.required],
    senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    instituicao: [''],
    dataCadastro: [{ value: this.today, disabled: true }],
  });
}

onSubmit() {
  if (this.cadastroForm.valid) {
    const formData = {
      ...this.cadastroForm.getRawValue(),
      role_id: 2 // Estudante
    };

    this.cadastroService.cadastrar(formData).subscribe({
      next: () => {
        notyf.success('Usuário cadastrado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        notyf.error('Erro ao cadastrar. Verifique os dados.');
      }
    });
  }
}

}
