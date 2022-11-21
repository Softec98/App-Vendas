import { Component, ElementRef, ViewChild, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pedido-impressao',
  templateUrl: './pedido-impressao.component.html',
  styleUrls: ['./pedido-impressao.component.scss']
})
export class PedidoImpressaoComponent {
  @ViewChild('frente')
  frente!: ElementRef;

  constructor(public dialogRef: MatDialogRef<PedidoImpressaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void { }
}