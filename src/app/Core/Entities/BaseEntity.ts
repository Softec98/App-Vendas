 export abstract class BaseEntity {

    constructor(init?: BaseEntity) {
      Object.assign(this, init);
      //  this.IdUsuario = init!.IdUsuario,
      //  this.datCadastro = init!.datCadastro,
      //  this.datAlteracao = init!.datAlteracao
    }

    public IdUsuario!: number;
    public datCadastro!: Date;
    public datAlteracao!: Date;
}