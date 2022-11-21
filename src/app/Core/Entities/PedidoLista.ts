import { PedidosDB } from './Pedidos';
import { clientes, fretes, status, db } from '../../Infrastructure/ApplicationDB';

export class PedidoLista extends PedidosDB {

  public NomeCliente!: string;
  public NomeFrete!: string;
  public NomeStatus!: string;
  public action!: string;
  
  log() {
    console.log(JSON.stringify(this));
  }

  public constructor(init?: Partial<PedidosDB>) {
    super(init);
    this.NomeCliente = typeof(this.Id_Cliente) == 'undefined' ? "N/Consta" : 
      clientes.find(x => x.key == this.Id_Cliente)?.value!;
    this.NomeFrete = typeof(this.Frete) == 'undefined' ? "N/Consta" : 
      fretes.find(x => x.key == this.Frete)?.value!;
    this.NomeStatus = typeof(this.Id_Status) == 'undefined' ? "N/Consta" : 
      status.find(x => x.key == this.Id_Status)?.value!;
  }
}