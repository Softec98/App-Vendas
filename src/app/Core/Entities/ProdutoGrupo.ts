export class ProdutoGrupoDB  {

    public Id!: number;
    public xNome!: string;
    public Id_NCM!: number;
    public ValidadeEmMeses!: number;

    public constructor(init?: ProdutoGrupoDB ) {
        Object.assign(this, init);
    }
}