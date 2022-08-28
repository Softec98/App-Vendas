import { Injectable } from '@angular/core';
import { db } from '../ApplicationDB';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  async obterCFOP() {
    return await db.CFOP.toArray();
  }
}
