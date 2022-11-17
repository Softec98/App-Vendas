import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { ListaPrecoComponent } from './Components/lista-preco/lista-preco.component';
import { PedidoComponent } from './Components/pedido/pedido.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'novo_pedido', component: ListaPrecoComponent },
  { path: 'pedidos', component: PedidoComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
