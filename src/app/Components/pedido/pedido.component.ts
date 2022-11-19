import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/Infrastructure/Service/data.service';
import { MatFormField } from '@angular/material/form-field';
import { ClientesDB } from 'src/app/Core/Entities/Clientes';
import { PedidosDB } from 'src/app/Core/Entities/Pedidos';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VERSION } from '@angular/material/core';
import { RepositionScrollStrategy } from '@angular/cdk/overlay';
import { IAuxiliar } from 'src/app/Core/Interface/IAuxiliar';
import { PedidoLista } from 'src/app/Core/Entities/PedidoLista';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpinnerOverlayService } from 'src/app/Infrastructure/Service/spinner.overlay.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss']
})
export class PedidoComponent implements OnInit {

  clientes: IAuxiliar[] = [];
  status: IAuxiliar[] = [];
  fretes: IAuxiliar[] = [];
  form!: FormGroup;
  isPhonePortrait: boolean = false;

  constructor(protected dataService: DataService,
              private changeDetectorRef: ChangeDetectorRef,
              private formBuilder: FormBuilder,
              private readonly spinner: SpinnerOverlayService,
              private responsive: BreakpointObserver) { 
  }

  private carregarSeletores() {
    const promise1 = this.dataService.obterFretes();
    const promise2 = this.dataService.obterStatus();
    Promise.allSettled([promise1, promise2]).
      then((results) => results.forEach((result) => console.log(result.status))).
      finally(() => this.atualizarSeletores());
  }

  private atualizarSeletores() {
    this.status = this.dataService.status;
    this.fretes = this.dataService.fretes;
  }

  displayedColumns = [
    'id',
    'datEmissao',
    'nomeFrete',
    'nomeCliente',
    'valTotal',
    'nomeStatus',
    'acoes'];

  dataSource!: MatTableDataSource<PedidoLista>;
  registros: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    
    this.responsive.observe([
      Breakpoints.HandsetPortrait,      
      ])
      .subscribe(result => {
        this.isPhonePortrait = false; 
        if (!result.matches) {
          this.isPhonePortrait = true;
        }
    }); 

		this.form = this.formBuilder.group({
			Frete: [''],
      Id_Cliente: [''],
      Id_Status: ['']
		});

    this.carregarSeletores();
    let pedidos = [...await this.dataService.obterPedidos()].map(pedido => new PedidoLista(pedido));
    this.dataSource = new MatTableDataSource(pedidos);
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 0);
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate =
      (data: any, filter: string) => {
        let retorno: boolean = true;
        if (filter.includes(':')) {
          const valor: string = filter.split(':')[1].toString();
          if (valor !== '-1') {
            const selectArray: string[] = [ 'Id_Cliente', 'Frete', 'Id_Status'];
            const indice = selectArray.indexOf(filter.split(':')[0]);
            if (indice > -1)
              retorno = data[selectArray[indice]] == valor
          }
        }
        else 
          retorno = filter.length < 3 || data.NomeCliente.toLowerCase().includes(filter) ? true : false; 
        return retorno;
      }
    this.registros = pedidos.length + 1;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onselect(selecao: any) {
    this.dataSource.filter = selecao.source.ngControl.name + ':' + selecao.source.value.toString(); 
  }

  @ViewChildren(MatFormField) formFields!: QueryList<MatFormField>;
  
  async openDialog(id?: number): Promise<void> {
    console.log(id);
  }

  async openDialogImpressao(id: number, action: string = 'show'): Promise<void> {
    let pedido: any;
    if (typeof id !== 'undefined') {
      this.spinner.show();
      pedido = new PedidoLista(await this.dataService.obterPedidoPorId(id)!);
      pedido.action = action;
      //this.dialog.open(ImpressaoDialogComponent, { data: publisher, width: '100%' });
      this.spinner.hide();
    }
  }

  async apagarPedido(id: number) {
    if (confirm("Deseja realmente apagar o pedido?")) {
      await this.dataService.apagarPedido(id);
      this.ngOnInit();
    }
  }
}