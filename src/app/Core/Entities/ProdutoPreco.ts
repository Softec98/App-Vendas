import { EFrete } from "../Enums/EFrete.enum";

export class ProdutoPrecoDB {

    public Id?: number;
    public Frete!: EFrete; 
    public Id_Produto!: number;
    public Id_Produto_Familia!: number;
    public Id_Produto_Grupo!: number;
    public vPreco!: number;
    public datValidade!: Date;

    public constructor(init?: Partial<ProdutoPrecoDB> ) {
        Object.assign(this, init);
    }
}