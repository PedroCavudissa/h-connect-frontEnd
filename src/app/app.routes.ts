import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { TelausuariosComponent } from './user/telausuarios/telausuarios.component';
import { UsuarioComponent } from './user/usuario/usuario.component';
import { ProjetosComponent } from './user/projecto/projecto.component';
import { ConexoesComponent } from './user/conexoes/conexoes.component';
import { PublicacoesComponent } from './user/publicacoes/publicacoes.component';
import { MensagensComponent } from './user/mensagens/mensagens.component';
import { NotificacoesComponent } from './user/notificacoes/notificacoes.component';
import { DefinicoesComponent } from './user/definicoes/definicoes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'telausuarios', component: TelausuariosComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'projecto', component: ProjetosComponent },
  {path:'conexoes',component: ConexoesComponent},
  {path:'pubicacoes',component: PublicacoesComponent},
  {path:'mensagens',component: MensagensComponent},
  {path:'notificacoes',component: NotificacoesComponent},
{path:'publicacoes',component: PublicacoesComponent},
{path:'definicoes',component: DefinicoesComponent}

];
