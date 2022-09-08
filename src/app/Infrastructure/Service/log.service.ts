import { Injectable } from '@angular/core';
import { ProdutosSemListaDePreco } from '../ApplicationDB';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  static produtosSemListaDePreco: ProdutosSemListaDePreco[] = [];

   static AdicionarProdutosSemListaDePreco(produtoSemListaDePreco: ProdutosSemListaDePreco): void {
    this.produtosSemListaDePreco.push(produtoSemListaDePreco);
  }
}