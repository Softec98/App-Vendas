export class EmbalagensDB  {

    public Id?: number;
    public cEmbalagem!: string;
    public xEmbalagem!: string;
    public Peso!: number;

    public constructor(init?: EmbalagensDB ) {
        Object.assign(this, init);
    }
}