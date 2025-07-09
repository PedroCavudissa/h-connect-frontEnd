import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; 

const notyf = new Notyf({
  duration: 3000, 
  position: {
    x: 'right',
    y: 'top',     
  },
});


@Component({
  selector: 'app-barralateral',
  standalone: true,
  imports: [],
  templateUrl: './barralateral.component.html',

  styleUrls: ['./barralateral.component.css']

})
export class BarralateralComponent {
  notyf = new Notyf({
    duration: 5000, 
    position: {
      x: 'right',
      y: 'top',     
    },
  });
  constructor( private router: Router) {}
  titulo = 'Dados Gerais';
  menuAtivo = false;

  toggleMenu(): void {
    this.menuAtivo = !this.menuAtivo;
   
  
  }

  selecionarMenu(item: string) {
 
    this.menuAtivo = false;

    switch (item) {
      case 'Perfil':
        {this.router.navigate(['/usuario']);
        break;}
        case 'Projetos':
        {this.router.navigate(['/projecto']);
        break;}
      case 'Inicio':
        {this.router.navigate(['telausuarios']);
        break;}
     

        case 'Conexões':
          {this.router.navigate(['/conexoes']);
          break;}
         
             
              case 'Mensagens':
               {this.notyf.success('Esta Tela Está Em Construção.');
                break;}

                
                case 'Reuniões':
                {this.router.navigate(['/reunioes']);
                break;}
                case 'Definições':
                  {this.router.navigate(['/definicoes']);
                  break;}
                
                
            
  

 
      default:
        this.notyf.success('Menu não reconhecido.');
        break;
    }
  }
  logout() {
  if(confirm('Você tem certeza que deseja sair?')) {
    localStorage.removeItem('token'); // Remove o token do localStorage
    this.router.navigate(['/home']); // Redireciona para a página de login
    this.notyf.success('Logout realizado com sucesso!');
  }
  
}
}