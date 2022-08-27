export class ProdutoFamiliaDB  {

    public Id!: number;
    public xNome!: string;
    public Id_Embalagem!: number;

    public constructor(init?: ProdutoFamiliaDB ) {
        Object.assign(this, init);
    }
}