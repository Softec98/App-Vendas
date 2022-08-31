import Dexie, { Table } from 'dexie';
import { CFOPDB } from '../Core/Entities/CFOP';
import { ClientesDB } from '../Core/Entities/Clientes';
import { CondPagtoDB } from '../Core/Entities/CondPagto';
import { EmbalagensDB } from '../Core/Entities/Embalagens';
import { NCMDB } from '../Core/Entities/NCM';
import { PedidosDB } from '../Core/Entities/Pedidos';
import { PedidosItensDB } from '../Core/Entities/PedidosItens';
import { ProdutoFamiliaDB } from '../Core/Entities/ProdutoFamilia';
import { ProdutoGrupoDB } from '../Core/Entities/ProdutoGrupo';
import { ProdutoPrecoDB } from '../Core/Entities/ProdutoPreco';
import { ProdutosDB } from '../Core/Entities/Produtos';
import { Utils } from '../Utils/Utils';
import cfop from '../../assets/data/CFOP.json';
import embalagem from '../../assets/data/Embalagens.json';
import prodFamilia from '../../assets/data/ProdFamilia.json'
import prodGrupo from '../../assets/data/ProdGrupo.json'
import ncm from '../../assets/data/NCM.json'
import condPagto from '../../assets/data/CondPagto.json'
import prodPreco from '../../assets/data/ProdPreco.json'
import produtos from '../../assets/data/Produtos.json'

export class ApplicationDB extends Dexie {

  CFOP!: Table<CFOPDB, number>;
  Clientes!: Table<ClientesDB, number>;
  CondPagto!: Table<CondPagtoDB, number>;
  Embalagens!: Table<EmbalagensDB, number>;
  NCM!: Table<NCMDB, number>;
  Pedidos!: Table<PedidosDB, number>;
  PedidosItens!: Table<PedidosItensDB, number>;
  ProdutoFamilia!: Table<ProdutoFamiliaDB, number>;
  ProdutoGrupo!: Table<ProdutoGrupoDB, number>;
  ProdutoPreco!: Table<ProdutoPrecoDB, number>;
  Produtos!: Table<ProdutosDB, number>;

  constructor() {
    super('AppVendasDB');
    this.version(1).stores({
        CFOP: '++Id',
        CondPagto: '++Id',
        Clientes: '++Id, xNome, CNPJ',
        Embalagens: '++Id',
        NCM: '++Id',
        Pedidos: '++Id, Id_Cliente',
        PedidosItens: '++Id, Id_Pedido, Id_Produto',
        ProdutoFamilia: '++Id, Id_Embalagem',
        ProdutoGrupo: '++Id, Id_NCM',
        ProdutoPreco: '++Id, Id_Cond_Pagto, Id_Produto, Id_Produto_Familia, Id_Produto_Grupo',
        Produtos: '++Id, cProd, xProd, Id_Produto_Familia, Id_Produto_Grupo, Id_Embalagem, Id_NCM'
    });

    this.CFOP.mapToClass(CFOPDB);
    this.Clientes.mapToClass(ClientesDB);
    this.CondPagto.mapToClass(CondPagtoDB);
    this.Embalagens.mapToClass(EmbalagensDB);
    this.NCM.mapToClass(NCMDB);
    this.Pedidos.mapToClass(PedidosDB);
    this.PedidosItens.mapToClass(PedidosItensDB);
    this.ProdutoFamilia.mapToClass(ProdutoFamiliaDB);
    this.ProdutoGrupo.mapToClass(ProdutoGrupoDB);
    this.ProdutoPreco.mapToClass(ProdutoPrecoDB);
    this.Produtos.mapToClass(ProdutosDB);

    this.on('populate', () => this.populate());
  }

  async populate() {
    // const todoListId = await db.todoLists.add({
    //   title: 'To Do Today',
    // });

    await Promise.all([
      db.CFOP.bulkAdd(Utils.ObterLista<CFOPDB>(cfop)),
      db.CondPagto.bulkAdd(Utils.ObterLista<CondPagtoDB>(condPagto)),
      db.Embalagens.bulkAdd(Utils.ObterLista<EmbalagensDB>(embalagem)),
      db.NCM.bulkAdd(Utils.ObterLista<NCMDB>(ncm)),
      db.ProdutoFamilia.bulkAdd(Utils.ObterLista<ProdutoFamiliaDB>(prodFamilia)),
      db.ProdutoGrupo.bulkAdd(Utils.ObterLista<ProdutoGrupoDB>(prodGrupo)),
      db.ProdutoPreco.bulkAdd(Utils.ObterLista<ProdutoPrecoDB>(prodPreco)),
      db.Produtos.bulkAdd(Utils.ObterLista<ProdutosDB>(produtos, ProdutosDB.name))
   ]);

  }
}

export const db = new ApplicationDB();
export const familiaJson = prodFamilia;
export const embalagemJson = embalagem;
export const grupoJson = prodGrupo;
export const precoJson = prodPreco;

export class DynamicClass {
  constructor(className: string, opts: any) {
      if (Store[className] === undefined || Store[className] === null) {
          throw new Error(`Class type of \'${className}\' is not in the store`);
      }
      return new Store[className](opts);
  }
}

export const Store: any = {
  CFOPDB,
  ClientesDB,
  CondPagtoDB,
  EmbalagensDB,
  NCMDB,
  PedidosDB,
  PedidosItensDB,
  ProdutoFamiliaDB,
  ProdutoGrupoDB,
  ProdutoPrecoDB,
  ProdutosDB }