import { PedidosDB } from './Pedidos';
import { db, fretes, status } from '../../Infrastructure/ApplicationDB';

export class PedidoDto extends PedidosDB {

  public NomeCliente!: string;
  public NomeFrete!: string;
  public NomeStatus!: string;
  public action!: string;

  log() {
    console.log(JSON.stringify(this));
  }

  public constructor(init?: Partial<PedidosDB>) {
    super(init);
    this.NomeCliente = typeof (this.Id_Cliente) == 'undefined' ? "N/Consta" :
      db.clientes_Pedidos.find(x => x.key == this.Id_Cliente)?.value!;
    this.NomeFrete = typeof (this.Frete) == 'undefined' ? "N/Consta" :
      fretes.find(x => x.key == this.Frete)?.value!;
    this.NomeStatus = typeof (this.Id_Status) == 'undefined' ? "N/Consta" :
      status.find(x => x.key == this.Id_Status)?.value!;
  }
}