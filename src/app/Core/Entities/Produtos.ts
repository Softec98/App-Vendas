export class ProdutosDB  {

    public Id?: number;
    public cProd!: string;
    public Unid!: string;
    public xProd!: string;
    public Id_Embalagem!: number;
    public Id_NCM!: number;
    public pBruto!: number;
    public pLiquido!: number;
    public pEmbalagem!: number;
    public cEAN!: string;
    public Id_ProdutoFamilia!: number;
    public Id_ProdutoGrupo!: number;
    public vVenda!: number;    
    public indLancamento!: boolean;
    public indInativo!: boolean;

    public constructor(init?: Partial<ProdutosDB> ) {
        Object.assign(this, init);

        
    }
}