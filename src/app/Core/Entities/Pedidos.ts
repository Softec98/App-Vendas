import { EFrete } from "../Enums/EFrete.enum";
import { BaseEntity } from "./BaseEntity";
import { PedidosItensDB } from '../Entities/PedidosItens';
import { db } from '../../Infrastructure/ApplicationDB';

export class PedidosDB extends BaseEntity {

    public Id!: number;
    public datEmissao!: Date;
    public Referencia!: string;
    public Codigo!: string;
    public Transacao!: number;
    public Id_Cliente!: number;
    public Id_Status!: number;
    public Id_Cond_Pagto!: number;
    public Id_Pagto_Tipo!: number;
    public Id_Pagto_Codigo!: number;
    public Frete!: EFrete;
    public valTotal: number = 0;
    public valDesconto: number = 0;
    public valFrete: number = 0;
    public valTaxas: number = 0;
    public valLiquido: number = 0;
    public Parcelas!: number;
    public Itens!: number;
    public TipoOperacao!: string;
    public datCredito!: Date;
    public bICMS!: number;
    public vICMS: number = 0;
    public bIPI!: number;
    public vIPI: number = 0;
    public bST!: number;
    public vST!: number;
    public vMerc: number = 0;
    public vTotalNF: number = 0;
    public TrackNumber!: string;
    public datEnvio!: Date;
    public PedidosItens!: PedidosItensDB[];

    public constructor(init?: Partial<PedidosDB> ) {
        super(init as PedidosDB)
        Object.assign(this, init);
    }

    async Salvar() : Promise<number> {
        await db.transaction('rw', db.Pedidos, db.PedidosItens, async () => {
            db.Pedidos.put(new PedidosDB(this))
            .then(Id => {
                this.Id = Id; 
                this.PedidosItens.map(item => {
                  item.Id_Pedido = Id;
                  db.PedidosItens.put(new PedidosItensDB(item));
              });
              return Id;
            });
        });
        // return db.Pedidos.put(new PedidosDB(this))
        //       .then(Id => this.Id = Id);
        // await db.transaction('rw', db.Pedidos, db.PedidosItens, async () => {
        //     return Promise.all(this.PedidosItens.map(item => db.PedidosItens.put(item)))
        //     .then(results => {
        //         const itensIds:any = results[0];              
        //         db.PedidosItens.where('Id_Pedido').equals(this.Id)
        //           .and(item => itensIds.indexOf(item.Id) === -1)
        //           .delete();
        //         db.Pedidos.put(new PedidosDB(this))
        //           .then(Id => this.Id = Id);
        //       });

        return this.Id;
    }

    Totalizar() {
        if (typeof(this.PedidosItens) != 'undefined') {
            this.vMerc = this.PedidosItens.reduce<number>((soma, item) => 
                { return soma + item.qProd * item.vProd; }, 0);
            this.valLiquido = this.vMerc + this.vICMS + this.vIPI;
            this.valTotal = this.valLiquido + this.valFrete + this.valTaxas - this.valDesconto;
        }
    }
}