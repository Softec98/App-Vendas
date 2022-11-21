import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { SpinnerOverlayService } from '../../Infrastructure/Service/spinner.overlay.service';

@Component({
  selector: 'app-impressao-dialog',
  templateUrl: './impressao-dialog.component.html',
  styleUrls: ['./impressao-dialog.component.scss']
})
export class ImpressaoDialogComponent {

  @ViewChild('tabGroup') tabGroup!: any;
  tabName: string = "frente";
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private readonly spinner: SpinnerOverlayService,
    private changeDetectorRef: ChangeDetectorRef) { }
 
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.tabName = tabChangeEvent.tab.textLabel.toLowerCase();
    console.log(this.tabName);
  }
 
  print(acao: string = 'print'): void {
    this.spinner.show();
    let DATA: any = document.getElementById(this.tabName);
    html2canvas(DATA, { scale: 1.5, useCORS: true })
      .then(canvas => {
        const contentDataURL = canvas.toDataURL('image/pdf')
        let pdf = new jsPDF('p', 'mm', 'a4', true);
        let pdfWidth = 208;
        let pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(contentDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        if (acao == 'download') {
          pdf.save(`Pedido-${this.data.Id}.pdf`);
        }
        else {
          window.open(URL.createObjectURL(pdf.output("blob")), '_blank');
        }
        this.spinner.hide();
      });
  }
}