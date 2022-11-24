import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/Utils/Utils';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesDB } from 'src/app/Core/Entities/Clientes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DataService } from 'src/app/Infrastructure/Service/data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-novo-cliente',
  templateUrl: './novo-cliente.component.html',
  styleUrls: ['./novo-cliente.component.scss']
})
export class NovoClienteComponent implements OnInit {

  isPhonePortrait: boolean = false;
  public form!: FormGroup;

  constructor(
    protected dataService: DataService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private responsive: BreakpointObserver
  ) { }

  async ngOnInit(): Promise<void> {
    this.responsive.observe([
      Breakpoints.HandsetPortrait,
    ]).subscribe(result => {
      this.isPhonePortrait = false;
      if (!result.matches) {
        this.isPhonePortrait = true;
      }
    });

    this.form = this.formBuilder.group({
      id: [0],
      cnpj: this.formBuilder.control({ value: '', disabled: false }, Utils.isDocumento()),
      IE: [''],
      nome: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^[a-zA-Z].*[\s\.]*$/),
        Validators.maxLength(100),
        Validators.minLength(5)
      ])),
      fantasia: [''],
      cep: [''],
      endereco: [''],
      complemento: [''],
      numero: [''],
      bairro: [''],
      cidade: [''],
      uf: [''],
      me: [''],
      ddd: [''],
      ddd2: [''],
      email: ['', Validators.email],
      fone: ['', Validators.pattern(/^\s*(\d{2}|\d{0})[-. ]?(\d{5}|\d{4}|d{5})[-. ]?(\d{4})[-. ]?\s*$/)],
      fone2: ['', Validators.pattern(/^\s*(\d{2}|\d{0})[-. ]?(\d{5}|\d{4}|d{5})[-. ]?(\d{4})[-. ]?\s*$/)],
      pais: ['']
    });

    const idCliente = Number(this.activatedRoute.snapshot.params["id"]);
    if (idCliente) {
      const cliente = await this.dataService.obterClientePorId(idCliente);
      if (cliente && cliente.CNPJ) {
        this.form.patchValue({
          cnpj: cliente.CNPJ
        });
      }
    }
  }

  async Salvar() { // Salvar Cliente
    let cnpj: string = this.form.controls['cnpj'].value.match(/\d/g)?.join('');
    if (typeof cnpj !== 'undefined' && cnpj !== null && cnpj !== '' &&
      (cnpj.length == 11 || cnpj.length == 14) && this.form.controls['cnpj'].valid) {
      let cliente = new ClientesDB();
      if (this.form.controls['id'].value != '0') {
        cliente.Id = this.form.controls['id'].value;
      }
      cliente.CNPJ = cnpj;
      cliente.IE = this.form.controls['IE'].value;
      cliente.xNome = this.form.controls['nome'].value;
      cliente.xFantasia = this.form.controls['fantasia'].value;
      cliente.CEP = this.form.controls['cep'].value;
      cliente.xLgr = this.form.controls['endereco'].value;
      cliente.nro = this.form.controls['numero'].value;
      cliente.xComplemento = this.form.controls['complemento'].value;
      cliente.cBairro = this.form.controls['bairro'].value;
      cliente.xMun = this.form.controls['cidade'].value;
      cliente.UF = this.form.controls['uf'].value;
      cliente.indME = this.form.controls['me'].value;
      cliente.cPais = this.form.controls['pais'].value;
      cliente.email = this.form.controls['email'].value;
      cliente.fone = this.form.controls['ddd'].value + ' ' + this.form.controls['fone'].value;
      cliente.fone2 = this.form.controls['ddd2'].value + ' ' + this.form.controls['fone2'].value;
      await this.dataService.salvarCliente(cliente);
    }
    alert("O cliente foi salvo com sucesso!");
    this.router.navigate(['/clientes']);
  }
}