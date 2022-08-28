import { BaseEntity } from "./BaseEntity";

export class PedidosDB extends BaseEntity {

    public Id!: number;
    public datEmissao!: Date;
    public Referencia!: string;
    public Codigo!: string;
    public Transacao!: number;
    public Id_Cliente!: number;
    public Id_Status!: number;
    public Id_Pagto_Tipo!: number;
    public Id_Pagto_Codigo!: number;
    public Id_Frete!: number;
    public valTotal!: number;
    public valDesconto!: number;
    public valFrete!: number;
    public valTaxas!: number;
    public valLiquido!: number;
    public Parcelas!: number;
    public Itens!: number;
    public TipoOperacao!: string;
    public datCredito!: Date;
    public bICMS!: number;
    public vICMS!: number;
    public bIPI!: number;
    public vIPI!: number;
    public bST!: number;
    public vST!: number;
    public vMerc!: number;
    public vTotalNF!: number;
    public TrackNumber!: string;
    public datEnvio!: Date;

    public constructor(init?: Partial<PedidosDB> ) {
        super(init as PedidosDB)
        Object.assign(this, init);
    }
}