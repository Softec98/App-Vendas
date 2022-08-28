export class EmbalagensDB {

    public Id?: number;
    public xEmbalagem!: string;
    public cEmbalagem!: string;
    public Peso!: number;

    public constructor(init?: Partial<EmbalagensDB> ) {
        Object.assign(this, init);
    }
}