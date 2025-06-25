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
                {this.router.navigate(['/mensagens']);
                break;}

                
                case 'Publicações':
                {this.router.navigate(['/publicacoes']);
                break;}
                case 'Definições':
                  {this.router.navigate(['/definicoes']);
                  break;}
                
                
            
  

 
      default:
        notyf.success('Menu não reconhecido.');
        break;
    }
  }
  logout(){
    if (confirm('Deseja realmente sair?')) {
      this.router.navigate(['/login']);
  }
  }
}
