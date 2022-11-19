import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DataService } from 'src/app/Infrastructure/Service/data.service';
import { LogService } from 'src/app/Infrastructure/Service/log.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dataService: DataService
  ) { }

  async ngOnInit(): Promise<void> {
    const cfop = await this.dataService.obterCFOP();

    if (LogService.produtosSemListaDePreco.length > 0) {
      const mensagem: string = LogService.produtosSemListaDePreco.map(x => x.toString()).join("\n") ;
      alert('Produtos sem lista de preço:\n\n' + mensagem);
    }
  }

}