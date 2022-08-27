export class CFOPDB  {

    public Id?: number;
    public xNome!: string;
    public TipoOperacao!: string;

    public constructor(init?: CFOPDB ) {
        Object.assign(this, init);
    }
}