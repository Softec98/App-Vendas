import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { db } from '../ApplicationDB';

@Injectable({
  providedIn: 'root'
})
export class DataService {

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

  getAllData(): Observable<any[]> {
    return this.http.get<any[]>('./assets/data/car-list.json');
  }
}