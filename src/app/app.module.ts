import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './Components/home/home.component';
import { ListaPrecoComponent } from './Components/lista-preco/lista-preco.component';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { CpfPipe } from './Infrastructure/Pipes/cpf.pipe';
import { CnpjPipe } from './Infrastructure/Pipes/cnpj.pipe';
import { SelectOnFoscusDirective } from './Infrastructure/Directives/select-on-foscus.directive';
import { MaskCepDirective } from './Infrastructure/Directives/mask-cep.directive';
import { MaskDateDirective } from './Infrastructure/Directives/mask-date.directive';
import { PedidoComponent } from './Components/pedido/pedido.component';
import { MaterialModule } from './material.module';
import { SpinnerOverlayComponent } from './Components/spinner-overlay/spinner-overlay.component';

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListaPrecoComponent,
    CpfPipe,
    CnpjPipe,
    SelectOnFoscusDirective,
    MaskCepDirective,
    MaskDateDirective,
    PedidoComponent,
    SpinnerOverlayComponent
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    MatProgressSpinnerModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor() { }
}