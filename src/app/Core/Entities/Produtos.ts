import { familiaJson, embalagemJson, grupoJson, precoJson } from "src/app/Infrastructure/ApplicationDB";
import { EmbalagensDB } from "./Embalagens";
import { ProdutoFamiliaDB } from "./ProdutoFamilia";
import { ProdutoGrupoDB } from "./ProdutoGrupo";
import { ProdutoPrecoDB } from "./ProdutoPreco";

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
    public Id_Produto_Familia!: number;
    public Id_Produto_Grupo!: number;
    public vVenda!: number;    
    public indLancamento!: boolean;
    public indInativo!: boolean;

    public constructor(init?: Partial<ProdutosDB> ) {
        Object.assign(this, init);

        const embalagens: EmbalagensDB[] = embalagemJson;
        const familia: ProdutoFamiliaDB[] = familiaJson; 
        const grupos: ProdutoGrupoDB[] = grupoJson;
        const precos: ProdutoPrecoDB[] = precoJson;        

        if (typeof(this.Id_Embalagem) == 'undefined' && familia.length > 0) {
            this.Id_Embalagem = familia.find(x => x.Id == this.Id_Produto_Familia)!.Id_Embalagem!;
        }

        const embalagem = embalagens.find(x => x.Id == this.Id_Embalagem)!;

        if (typeof(embalagem) !== 'undefined') {
            if (typeof(this.Unid) == 'undefined' ) {
                this.Unid = embalagem?.cEmbalagem!;
            }
            if (typeof(this.pLiquido) == 'undefined') {
                this.pLiquido = embalagem?.Peso!;
            }
            if (typeof(this.pBruto) == 'undefined') {
                this.pBruto = embalagem?.Peso! + embalagem?.pEmbalagem!;
            }
        }

        if (typeof(this.Id_NCM) == 'undefined' && grupos.length > 0) {
            this.Id_NCM = grupos.find(x  => x.Id == this.Id_Produto_Grupo)!.Id_NCM!;
        }

        if (typeof(this.vVenda) == 'undefined' && precos.length > 0) {
            this.vVenda = precos.find(x => x.Id_Cond_Pagto == 1 && (
            x.Id_Produto == this.Id || x.Id_Produto_Familia == this.Id_Produto_Familia ||
            x.Id_Produto_Grupo == this.Id_Produto_Grupo))!.vPreco!
        }
    }
}