import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { TelausuariosComponent } from './user/telausuarios/telausuarios.component';
import { UsuarioComponent } from './user/usuario/usuario.component';
import { ProjetosComponent } from './user/projecto/projecto.component';
import { ConexoesComponent } from './user/conexoes/conexoes.component';
import { MensagensComponent } from './user/mensagens/mensagens.component';
import { NotificacoesComponent } from './user/notificacoes/notificacoes.component';
import { DefinicoesComponent } from './user/definicoes/definicoes.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { ReunioesComponent } from './user/reunioes/reunioes.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent,},
  { path: 'telausuarios', component: TelausuariosComponent,canActivate: [AuthGuard]  },
  { path: 'usuario', component: UsuarioComponent,canActivate: [AuthGuard]  },
  { path: 'projecto', component: ProjetosComponent,canActivate: [AuthGuard]  },
  {path:'conexoes',component: ConexoesComponent,canActivate: [AuthGuard] },
  {path:'mensagens',component: MensagensComponent,canActivate: [AuthGuard] },
  {path:'notificacoes',component: NotificacoesComponent,canActivate: [AuthGuard] },
{path:'definicoes',component: DefinicoesComponent, canActivate: [AuthGuard] },
 {path:'recuperar', component: RecuperarComponent, canActivate: [AuthGuard] },
 {path:'reunioes', component: ReunioesComponent, canActivate: [AuthGuard] }
];
