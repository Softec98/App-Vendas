import Dexie, { Table } from 'dexie';
import { CFOPDB } from '../Core/Entities/CFOP';
import { ClientesDB } from '../Core/Entities/Clientes';
import { EmbalagensDB } from '../Core/Entities/Embalagens';
import { NCMDB } from '../Core/Entities/NCM';
import { PedidosDB } from '../Core/Entities/Pedidos';
import { PedidosItensDB } from '../Core/Entities/PedidosItens';
import { ProdutoFamiliaDB } from '../Core/Entities/ProdutoFamilia';
import { ProdutoGrupoDB } from '../Core/Entities/ProdutoGrupo';
import { ProdutosDB } from '../Core/Entities/Produtos';
import { Utils } from '../Utils/Utils';
import cfop from './Data/CFOP.json';
import embalagem from './Data/Embalagens.json';
import prodFamilia from './Data/ProdFamilia.json'
import prodGrupo from './Data/ProdGrupo.json'

export class ApplicationDB extends Dexie {
  CFOP!: Table<CFOPDB, number>;
  Clientes!: Table<ClientesDB, number>;
  Embalagens!: Table<EmbalagensDB, number>;
  NCM!: Table<NCMDB, number>;
  Pedidos!: Table<PedidosDB, number>;
  PedidosItens!: Table<PedidosItensDB, number>;
  ProdutoFamilia!: Table<ProdutoFamiliaDB, number>;
  ProdutoGrupo!: Table<ProdutoGrupoDB, number>;
  Produtos!: Table<ProdutosDB, number>;

  constructor() {
    super('AppVendasDB');
    this.version(1).stores({
        CFOP: '++Id',
        Clientes: '++Id',
        Embalagens: '++Id',
        NCM: '++Id',
        Pedidos: '++Id',
        PedidosItens: '++Id',
        ProdutoFamila: '++Id',
        ProdutoGrupo: '++Id',
        Produtos: '++Id'
    });

    this.CFOP.mapToClass(CFOPDB);
    this.Clientes.mapToClass(ClientesDB);
    this.Embalagens.mapToClass(EmbalagensDB);
    this.NCM.mapToClass(NCMDB);
    this.Pedidos.mapToClass(PedidosDB);
    this.PedidosItens.mapToClass(PedidosItensDB);
    //this.ProdutoFamilia.mapToClass(ProdutoFamiliaDB);
    this.ProdutoGrupo.mapToClass(ProdutoGrupoDB);
    this.Produtos.mapToClass(ProdutosDB);

    this.on('populate', () => this.populate());
  }

  async populate() {
    // const todoListId = await db.todoLists.add({
    //   title: 'To Do Today',
    // });

    db.CFOP.bulkAdd(this.ObterLista<CFOPDB>(cfop));
    db.Embalagens.bulkAdd(this.ObterLista<EmbalagensDB>(embalagem));
    db.ProdutoGrupo.bulkAdd(this.ObterLista<ProdutoGrupoDB>(prodGrupo));
    //db.ProdutoFamilia.bulkAdd(this.ObterLista<ProdutoFamiliaDB>(prodFamilia));

    // await db.NCM.bulkAdd([
    //     {
    //         Id: 1,
    //         NCM: '28363000',
    //         EXTIPI: '',
    //         pIPI: 0,
    //         vIPI: 0,
    //         cIPI: ''
    //     },
    //     {
    //         Id: 2,
    //         NCM: '29054500',
    //         EXTIPI: '',
    //         pIPI: 0,
    //         vIPI: 0,
    //         cIPI: ''
    //     },
    //     {
    //         Id: 3,
    //         NCM: '32021000',
    //         EXTIPI: '',
    //         pIPI: 0,
    //         vIPI: 0,
    //         cIPI: ''
    //     },
    //     {
    //         Id: 4,
    //         NCM: '32049000',
    //         EXTIPI: '',
    //         pIPI: 0,
    //         vIPI: 0,
    //         cIPI: ''
    //     },
    //     {
    //         Id: 5,
    //         NCM: '32042090',
    //         EXTIPI: '',
    //         pIPI: 0,
    //         vIPI: 0,
    //         cIPI: ''
    //     },        
    //     {
    //         Id: 6,
    //         NCM: '32061910',
    //         EXTIPI: '',
    //         pIPI: 0,
    //         vIPI: 0,
    //         cIPI: ''
    //     }
    // ]);

    // await db.Produtos.bulkAdd([
    //     {
    //         cProd:'METÁLICA DOURADO',
    //         Unid:'',
    //         xProd: '',
    //         Id_Embalagem: 6,
    //         Id_NCM: 6,
    //         pBruto: 0,
    //         pLiquido: 0,
    //         pEmbalagem: 0,
    //         cEAN: '',
    //         Id_ProdutoGrupo: 1,
    //         Id_ProdutoFamilia: 1,
    //         vVenda: 0,  
    //         indLancamento: true,
    //         indInativo: true
    //     }
    // ])
  }

  ObterLista<T>(objeto: any): any {
    return Object.keys(objeto).map((i: any) => {
      return this.Tabela<T>(objeto[i]) })
  }

  Tabela <T>(value: T) : T {
    return value;
  }
}

export const db = new ApplicationDB();