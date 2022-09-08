import { Injectable } from '@angular/core';
import { ProdutosSemListaDePreco } from '../ApplicationDB';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor() { }

  static listaDeProdutosSemListaDePreco: ProdutosSemListaDePreco[] = [];

   static constroiProdutosSemListaDePreco(produtoSemListaDePreco: ProdutosSemListaDePreco): void {
    this.listaDeProdutosSemListaDePreco.push(produtoSemListaDePreco);
  }
}