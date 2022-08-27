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

export class ApplicationDB extends Dexie {
  CFOP!: Table<CFOPDB, number>;
  Clientes!: Table<ClientesDB, number>;
  Embalagens!: Table<EmbalagensDB, number>;
  NCM!: Table<NCMDB, number>;
  Pedidos!: Table<PedidosDB, number>;
  ProdutoFamilia!: Table<ProdutoFamiliaDB, number>;
  ProdutoGrupo!: Table<ProdutoGrupoDB, number>;
  PedidosItens!: Table<PedidosItensDB, number>;
  Produto!: Table<ProdutosDB, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
        CFOP: '++Id',
        Clientes: '++Id',
        NCM: '++Id',
        Pedidos: '++Id',
        PedidosItens: '++Id',
        ProdutoGrupo: '++Id',
        Produtos: '++Id'
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    // const todoListId = await db.todoLists.add({
    //   title: 'To Do Today',
    // });
    await db.CFOP.bulkAdd([
      {
        Id: 5101,
        xNome: 'Venda de produção do estabelecimento',
        TipoOperacao: 'S'
      },
      {
        Id: 5102,
        xNome: 'Venda de mercadoria adquirida ou recebida de terceiros',
        TipoOperacao: 'S'
      },
      {
        Id: 6101,
        xNome: 'Venda de produção do estabelecimento',
        TipoOperacao: 'S'
      },
      {
        Id: 6102,
        xNome: 'Venda de mercadoria adquirida ou recebida de terceiros',
        TipoOperacao: 'S'
      },      
    ]);

    await db.Embalagens.bulkAdd([
      {
        Id: 1,
        xEmbalagem: '6X25G',
        cEmbalagem: 'CX',
        Peso: 0
      },
      {
        Id: 2,
        xEmbalagem: '6X60G',
        cEmbalagem: 'CX',
        Peso: 0
      },      
      {
        Id: 3,
        xEmbalagem: '12X3G',
        cEmbalagem: 'CX',
        Peso: 0
      },
      {
        Id: 4,
        xEmbalagem: '12X5G',
        cEmbalagem: 'CX',
        Peso: 0
      },
      {
        Id: 5,
        xEmbalagem: '12X15G',
        cEmbalagem: 'CX',
        Peso: 0
      },  
      {
        Id: 6,
        xEmbalagem: '12X40G',
        cEmbalagem: 'CX',
        Peso: 0
      },
      {
        Id: 7,
        xEmbalagem: '12X50G',
        cEmbalagem: 'CX',
        Peso: 0
      },
      {
        Id: 8,
        xEmbalagem: '12X60G',
        cEmbalagem: 'CX',
        Peso: 0
      },            
      {
        Id: 9,
        xEmbalagem: '12X10ML',
        cEmbalagem: 'CX',
        Peso: 0
      },         
      {
        Id: 10,
        xEmbalagem: '12X270ML',
        cEmbalagem: 'CX',
        Peso: 0
      },
      {
        Id: 11,
        xEmbalagem: '30X50ML',
        cEmbalagem: 'CX',
        Peso: 0
      },
    ])

    await db.ProdutoFamilia.bulkAdd([
        {
          Id: 1,
          xNome: 'PÓS, GEL E BRILHO DECORATIVOS - METÁLICOS',
          Id_Embalagem: 0
        },
        {
          Id: 2,
          xNome: 'PÓS, GEL E BRILHO DECORATIVOS - COLORIDOS',
          Id_Embalagem: 3
        },
        {
          Id: 3,
          xNome: 'PÓS, GEL E BRILHO DECORATIVOS - BRILHO',
          Id_Embalagem: 3
        },
        {
          Id: 4,
          xNome: 'PÓS, GEL E BRILHO DECORATIVOS - GEL',
          Id_Embalagem: 5
        },                        
        {
          Id: 5,
          xNome: 'ÁLCOOL E SOLUÇÃO ALCOÓLICA',
          Id_Embalagem: 0
        },
        {
          Id: 6,
          xNome: 'ADITIVOS',
          Id_Embalagem: 0
        },
        {
          Id: 7,
          xNome: 'CORANTE LÍQUIDO',
          Id_Embalagem: 9
        },
        {
          Id: 8,
          xNome: 'CORANTE GEL',
          Id_Embalagem: 5
        },
        {
          Id: 9,
          xNome: 'CORANTE SOFTGEL 25G',
          Id_Embalagem: 1
        },
        {
          Id: 10,
          xNome: 'CORANTE SOFTGEL 60G',
          Id_Embalagem: 2
        },
        {
          Id: 11,
          xNome: 'CORANTE NEOCOLOR',
          Id_Embalagem: 1
        },
        {
          Id: 12,
          xNome: 'GLITTER COLOR',
          Id_Embalagem: 4
        },
        {
          Id: 13,
          xNome: 'GLITTER HOLOGRAFICO',
          Id_Embalagem: 4
        },
        {
          Id: 14,
          xNome: 'PÓ P/ DECORAÇÃO NEON',
          Id_Embalagem: 4
        },
        {
          Id: 15,
          xNome: 'CORANTE SOFTGEL NEON 25G',
          Id_Embalagem: 1
        },
        {
          Id: 16,
          xNome: 'GLITTER CANDY',
          Id_Embalagem: 4
        },
        {
          Id: 17,
          xNome: 'GLITTER NEON',
          Id_Embalagem: 4
        },
        {
          Id: 18,
          xNome: 'GLITTER COLOR',
          Id_Embalagem: 4
        },        
        {
          Id: 19,
          xNome: 'CANETA MÁGICA CORES TRADICIONAIS 60G',
          Id_Embalagem: 2
        },                             
        {
          Id: 20,
          xNome: 'CANETA MÁGICA NEON 60G',
          Id_Embalagem: 2
        },                             
    ]);

    await db.ProdutoGrupo.bulkAdd([
      {
        Id: 1,
        xNome: 'PÓS, GEL E BRILHO DECORATIVOS',
        Id_NCM: 6,
        ValidadeEmMeses: 36
      },
      {
        Id: 2,
        xNome: 'ALCOOL E SOLUÇÃO',
        Id_NCM: 0,
        ValidadeEmMeses: 24
      },
      {
        Id: 3,
        xNome: 'ADITIVOS',
        Id_NCM: 0,
        ValidadeEmMeses: 30
      },      
      {
        Id: 4,
        xNome: 'CORANTES LÍQUIDO',
        Id_NCM: 3,
        ValidadeEmMeses: 36
      },      
      {
        Id: 5,
        xNome: 'CORANTES (SOFT)GEL',
        Id_NCM: 3,
        ValidadeEmMeses: 24
      },        
      {
        Id: 6,
        xNome: 'GLITTER',
        Id_NCM: 4,
        ValidadeEmMeses: 48
      },      
      {
        Id: 7,
        xNome: 'CANETA',
        Id_NCM: 0,
        ValidadeEmMeses: 24
      },
      {
        Id: 7,
        xNome: 'PÓ P/ DECORAÇÃO NEON',
        Id_NCM: 5,
        ValidadeEmMeses: 48
      }      
    ])

    await db.NCM.bulkAdd([
        {
            Id: 1,
            NCM: '28363000',
            EXTIPI: '',
            pIPI: 0,
            vIPI: 0,
            cIPI: ''
        },
        {
            Id: 2,
            NCM: '29054500',
            EXTIPI: '',
            pIPI: 0,
            vIPI: 0,
            cIPI: ''
        },
        {
            Id: 3,
            NCM: '32021000',
            EXTIPI: '',
            pIPI: 0,
            vIPI: 0,
            cIPI: ''
        },
        {
            Id: 4,
            NCM: '32049000',
            EXTIPI: '',
            pIPI: 0,
            vIPI: 0,
            cIPI: ''
        },
        {
            Id: 5,
            NCM: '32042090',
            EXTIPI: '',
            pIPI: 0,
            vIPI: 0,
            cIPI: ''
        },        
        {
            Id: 6,
            NCM: '32061910',
            EXTIPI: '',
            pIPI: 0,
            vIPI: 0,
            cIPI: ''
        }
    ]);

    await db.Produto.bulkAdd([
        {
            cProd:'METÁLICA DOURADO',
            Unid:'',
            xProd: '',
            Id_Embalagem: 6,
            Id_NCM: 6,
            pBruto: 0,
            pLiquido: 0,
            pEmbalagem: 0,
            cEAN: '',
            Id_ProdutoGrupo: 1,
            Id_ProdutoFamilia: 1,
            vVenda: 0,  
            indLancamento: true,
            indInativo: true
        }
    ])
  }
}

export const db = new ApplicationDB();