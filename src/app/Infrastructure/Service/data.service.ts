import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuxiliar } from 'src/app/Core/Interface/IAuxiliar';
import { db } from '../ApplicationDB';
import { ClientesDB } from '../../Core/Entities/Clientes';
import { Utils } from 'src/app/Utils/Utils';
import { CondPagtoDB } from 'src/app/Core/Entities/CondPagto';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  status: IAuxiliar[] = [];
  fretes: IAuxiliar[] = [];
  condpg: CondPagtoDB[] = [];

  constructor(private http: HttpClient) { }

  async obterCFOP() {
    return await db.CFOP.toArray();
  }

  async obterProdutos(filter: string = '') {
    if (filter == '')
      return await db.Produtos.toArray();
    else
      return await db.Produtos.filter(x =>
        x.xProd.toLowerCase().includes(filter.toLowerCase())).toArray();
  }

  ObterEstados(): Observable<IAuxiliar[]> {
    return this.http.get<any[]>('./assets/data/Estados.json');
  }

  async obterClientePeloCnpj(cnpj: string) {
    return await db.Clientes.filter(x => x.CNPJ == cnpj).first();
  }

  async SalvarCliente(data: ClientesDB): Promise<number> {
    await db.transaction('rw', db.Clientes, function () {
      db.Clientes.put(data);
    }).catch(function (err) {
      console.error(err.stack || err);
    });
    return data.Id;
  }

  async obterCondPagto(): Promise<void> {
    if (this.condpg.length == 0) {
      this.condpg = await db.CondPagto.toArray();
    }
  }

  async obterCondPagtoPorId(id: number) {
    await this.obterCondPagto();
    return this.condpg.find(x => x.Id == id);
  }

  async obterFretes(): Promise<void> {
    if (this.fretes.length == 0) {
      await Utils.getAuxiliar(`Frete`).then((aux) => {
        this.fretes = aux;
      });
    }
  }

  async obterStatus(): Promise<void> {
    if (this.status.length == 0) {
      await Utils.getAuxiliar(`Status`).then((aux) => {
        this.status = aux;
      });
    }
  }

  async obterClientes(filter: number[] = []) {
    if (filter.length == 0)
      return await db.Clientes.orderBy('xNome').toArray();
    else
      return await db.Clientes.orderBy('xNome')
        .filter(x => filter.includes(x.Id)).toArray();
  }

  async obterPedidos() {
      return await db.Pedidos.toArray();
  }

  async obterPedidoPorId(id: number) {
    return await db.Pedidos.get(id);
  }

  async obterPedidosIdClientes() {
    return await db.Pedidos.orderBy('Id_Cliente').uniqueKeys(function (keysArray) {
      return keysArray;
     });
  }

  async apagarPedido(id: number) {
    await db.transaction('rw', db.Pedidos, function () {
      db.Pedidos.delete(id);
    }).catch(function (err) {
      console.error(err.stack || err);
    });
  }
}