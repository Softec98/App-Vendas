import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { ListaPrecoComponent } from './Components/lista-preco/lista-preco.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'novo_pedido', component: ListaPrecoComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
