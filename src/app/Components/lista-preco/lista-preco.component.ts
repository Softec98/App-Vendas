import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/Infrastructure/Service/data.service';
import { ProdutosDB } from 'src/app/Core/Entities/Produtos';
import { ProdutoLista } from 'src/app/Core/Entities/ProdutoLista'
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EmpresaService } from 'src/app/Infrastructure/Service/empresa.service';
import { Utils } from 'src/app/Utils/Utils';
import { CepService } from 'src/app/Infrastructure/Service/cep.service';
import { IAuxiliar } from 'src/app/Core/Interface/IAuxiliar';
import cliente_validation from "../../../assets/data/Cliente-validation.json";
import { ClientesDB } from 'src/app/Core/Entities/Clientes';
import { PedidosDB } from 'src/app/Core/Entities/Pedidos';
import { PedidosItensDB } from 'src/app/Core/Entities/PedidosItens';
import { ncmJson } from 'src/app/Infrastructure/ApplicationDB';
import { NCMDB } from 'src/app/Core/Entities/NCM';
import { EFrete } from 'src/app/Core/Enums/EFrete.enum';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export class Group {
	level = 0;
	expanded = false;
	totalCounts = 0;
}

@Component({
	selector: 'lista-preco.component',
	styleUrls: ['lista-preco.component.scss'],
	templateUrl: 'lista-preco.component.html',
})

export class ListaPrecoComponent implements OnInit {

	validation_messages = cliente_validation;

	public dataSource = new MatTableDataSource<any | Group>([]);

	columns: any[];
	displayedColumns: string[];
	groupByColumns: string[] = [];
	allData!: any[];
	_allGroup!: any[];

	expandedProduto: any[] = [];
	expandedSubProduto: ProdutoLista[] = [];
	Estados: IAuxiliar[] = [];

	editRowId: number = -1

	@ViewChildren(MatInput, { read: ElementRef }) inputs: QueryList<ElementRef> | undefined;
	@ViewChild(MatSort) sort!: MatSort;

	public form!: FormGroup;

	cepMask = Utils.cepMask;
	foneMask = Utils.foneMask();
	documentoMask = Utils.documentoMask();

	constructor(
		protected dataService: DataService,
		protected empresaService: EmpresaService,
		protected cepService: CepService,
		private formBuilder: FormBuilder,
		private router: Router
	) {
		this.columns = [
			{
				display: 'Código',
				field: 'cProd'
			}, {
				display: 'UN.',
				field: 'Unid'
			}, {
				display: 'Descrição',
				field: 'xProd'
			}, {
				display: 'Qtde',
				field: 'qProd'
			}, {
				display: 'Preço',
				field: 'vVenda'
			}];
		this.displayedColumns = this.columns.map(column => column.field);
		this.groupByColumns = ['Familia'];
		this.dataSource.sort = this.sort;
	}

	edit(row: number, element: string) {
		this.editRowId = row;
		setTimeout(() => {
			const qtde = this.inputs!.find(x => x.nativeElement.getAttribute('name') == element)!
			if (qtde != null) {
				qtde.nativeElement.select();
				qtde.nativeElement.focus();
			}
		})
	}

	async ngOnInit(): Promise<void> {
		this.dataService.ObterEstados().subscribe(data => {
			this.Estados = data;
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

		await this.ObterListaDePreco();
	}

	async applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		if (filterValue.length == 0 || filterValue.length > 2) {
			await this.ObterListaDePreco(filterValue);
		}
	}

	groupHeaderClick(row: any) {
		if (row.expanded) {
			row.expanded = false;
			this.dataSource.data = this.getGroups(this.allData, this.groupByColumns);
		} else {
			row.expanded = true;
			this.expandedProduto = row;
			this.dataSource.data = this.addGroupsNew(this._allGroup, this.allData, this.groupByColumns, row);
		}
	}

	getGroups(data: any[], groupByColumns: string[]): any[] {
		const rootGroup = new Group();
		rootGroup.expanded = false;
		return this.getGroupList(data, 0, groupByColumns, rootGroup);
	}

	getGroupList(data: any[], level: number = 0, groupByColumns: string[], parent: Group): any[] {
		if (level >= groupByColumns.length) {
			return data;
		}
		let groups = this.uniqueBy(
			data.map(
				row => {
					let result = new Group();
					result.level = level + 1;
					for (let i = 0; i <= level; i++) {
						(result as any)[groupByColumns[i]] = row[groupByColumns[i]];
					}
					return result;
				}
			),
			JSON.stringify);

		const currentColumn = groupByColumns[level];

		groups.forEach((group: { [x: string]: any; totalCounts: number; }) => {
			const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
			group.totalCounts = rowsInGroup.length;
			this.expandedSubProduto = [];
		});

		groups = groups.sort((a: ProdutosDB, b: ProdutosDB) => {
			const isAsc = 'asc';
			return this.compare(a.Id_Produto_Familia, b.Id_Produto_Familia, isAsc);

		});
		this._allGroup = groups;
		return groups;
	}

	addGroupsNew(allGroup: any[], data: any[], groupByColumns: string[], dataRow: any): any[] {
		const rootGroup = new Group();
		rootGroup.expanded = true;
		return this.getSublevelNew(allGroup, data, 0, groupByColumns, rootGroup, dataRow);
	}

	getSublevelNew(allGroup: any[], data: any[], level: number, groupByColumns: string[],
		parent: Group, dataRow: any): any[] {
		if (level >= groupByColumns.length) {
			return data;
		}
		const currentColumn = groupByColumns[level];
		let subGroups: any = [];
		allGroup.forEach(group => {
			const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
			group.totalCounts = rowsInGroup.length;

			if (group.Familia == dataRow.Familia.toString()) {
				group.expanded = dataRow.expanded;
				const subGroup = this.getSublevelNew(allGroup, rowsInGroup, level + 1, groupByColumns,
					group, dataRow.Familia.toString());
				this.expandedSubProduto = subGroup;
				subGroup.unshift(group);
				subGroups = subGroups.concat(subGroup);
			} else {
				subGroups = subGroups.concat(group);
			}
		});
		return subGroups;
	}

	uniqueBy(a: any, key: any) {
		const seen: any = {};
		return a.filter((item: any) => {
			const k: string = key(item);
			return seen.hasOwnProperty(k) ? false : (seen[k] = true);
		});
	}

	isGroup(index: number, item: any): boolean {
		return item.level;
	}

	onSortData(sort: MatSort) {
		let data = this.allData;
		const index = data.findIndex(x => x['level'] == 1);
		if (sort.active && sort.direction !== '') {
			if (index > -1) {
				data.splice(index, 1);
			}

			data = data.sort((a: ProdutoLista, b: ProdutoLista) => {
				const isAsc = sort.direction === 'asc';
				switch (sort.active) {
					case 'cProd':
						return this.compare(a.cProd, b.cProd, isAsc);
					case 'Unid':
						return this.compare(a.Unid, b.Unid, isAsc);
					case 'xProd':
						return this.compare(a.xProd, b.xProd, isAsc);
					case 'vVenda':
						return this.compare(a.vVenda, b.vVenda, isAsc);
					case 'Familia':
						return this.compare(a.Familia, b.Familia, isAsc);
					default:
						return 0;
				}
			});
		}
		this.dataSource.data = this.addGroupsNew(this._allGroup, data, this.groupByColumns, this.expandedProduto);
		console.log('Sort');
	}

	AlgumProdutoComQtde(): boolean {
		if (this.allData)
			for (let row of this.allData) {
				if (row.Id != 0 && row.qProd > 0) return true;
			}
		return false;
	}

	scroll(id: string) {
		const element = document.getElementById(id);
		element?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		element?.focus();
	}

	BuscarEmpresa(event: Event): void {
		const cnpj = (event.target as HTMLInputElement).value.match(/\d/g)?.join('');
		this.BuscarEmpresaIcon(cnpj);
	}

	async BuscarEmpresaIcon(cnpj?: string): Promise<void> {
		cnpj = cnpj?.match(/\d/g)?.join('');
		if (typeof cnpj !== 'undefined' && cnpj !== null && cnpj !== '' && 
			cnpj.length == 14 && this.form.controls['cnpj'].valid) {
			var cliente = await this.dataService.obterClientePeloCnpj(cnpj);
			if (cliente != null) {
				this.form.patchValue({
					id: cliente.Id,
					nome: cliente.xNome,
					IE: cliente.IE,
					fantasia: cliente.xFantasia,
					cep: cliente.CEP,
					endereco: cliente.xLgr,
					numero: cliente.nro,
					complemento: cliente.xComplemento,
					bairro: cliente.cBairro,
					cidade: cliente.xMun,
					uf: cliente.UF,
					me: cliente.indME,
					pais: cliente.cPais,
					email: cliente.email,
					ddd: cliente.fone?.split(' ')[0] ?? '',
					fone: cliente.fone?.split(' ')[1] ?? '',
					ddd2: cliente.fone2?.split(' ')[0] ?? '',
					fone2: cliente.fone2?.split(' ')[1] ?? '',
				});
			}
			else {
				this.empresaService.obterEmpresa(cnpj)
					.subscribe({
						next: (empresa: any) => {
							if (this) {
								this.form.patchValue({
									id: 0,
									nome: empresa.company.name,
									fantasia: empresa.alias!,
									cep: empresa.address.zip,
									endereco: empresa.address.street,
									numero: empresa.address.number,
									complemento: empresa.address.details!,
									bairro: empresa.address.district,
									cidade: empresa.address.city,
									uf: empresa.address.state,
									me: empresa.company.size.text == "Microempresa",
									pais: empresa.address.country.name,
									email: empresa.emails.length > 0 ? empresa.emails[0].address : '',
									ddd: empresa.phones.length > 0 ? empresa.phones[0].area : '',
									fone: empresa.phones.length > 0 ? empresa.phones[0].number : '',
									ddd2: empresa.phones.length > 1 ? empresa.phones[1].area : '',
									fone2: empresa.phones.length > 1 ? empresa.phones[1].number : ''
								});
							}
							//this.focarNoNumero();
						},
						error: (err: any) => {
							alert(`Não foi possível encontrar a empresa,\nverifique se o CNPJ está correto.`);
						}
					});
			}
		}
	}

	ObterEndereco() {
		let cep: string = this.form.controls['cep'].value.match(/\d/g)?.join('');
		if (typeof cep !== 'undefined' && cep !== null && cep !== '' && this.form.controls['cep'].valid) {
			this.cepService.ObterEndereco(cep)
				.subscribe({
					next: (endereco: any) => {
						if (this)
							this.form.patchValue({
								endereco: endereco.logradouro,
								complemento: endereco.complemento,
								bairro: endereco.bairro,
								uf: endereco.uf,
								cidade: endereco.localidade
							});
					},
					error: (err: any) => {
						alert(`Erro ao buscar o CEP: ${err.message}`);
					}
				});
		}
	}

	async SalvarPedido() {
		const ncm: NCMDB[] = ncmJson;
		let idCliente = 0;
		let uf = ''
		let cnpj: string = this.form.controls['cnpj'].value.match(/\d/g)?.join('');
		if (typeof cnpj !== 'undefined' && cnpj !== null && cnpj !== '' && 
			(cnpj.length == 11 || cnpj.length == 14) && this.form.controls['cnpj'].valid) {
			let cliente = new ClientesDB();
			if (this.form.controls['id'].value != '0') {
				cliente.Id = this.form.controls['id'].value; }
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
				uf = cliente.UF;
				idCliente = await this.dataService.SalvarCliente(cliente);
				this.form.patchValue({
					id: idCliente
				});
			}
 
			if (idCliente > 0) {
				let condpg = await this.dataService.obterCondPagtoPorId(environment.Id_Cond_Pagto[0]);
				let pedido = new PedidosDB();
				pedido.Id_Cond_Pagto = environment.Id_Cond_Pagto[0];
				pedido.Id_Cliente = idCliente;
				pedido.Id_Status = 1;
				pedido.Frete = condpg?.Frete!
				pedido.Id_Pagto_Codigo = 1;
				pedido.Parcelas = 1;
				pedido.datCadastro = new Date();
				pedido.datEmissao = new Date();
				pedido.PedidosItens = [];
				if (this.allData) {
					const itensQtd = this.allData.filter(function (x) { return x.qProd > 0 });
					itensQtd.map(item => {
						let pedidoItem = new PedidosItensDB();
						pedidoItem.Id_Produto = item.Id;
						pedidoItem.NCM = ncm.find(x => item.Id_NCM == x.Id)?.NCM!;
						pedidoItem.CFOP = uf == 'SP' ? 5101 : 6101;
						pedidoItem.Unid = item.Unid;
						pedidoItem.cProd = item.cProd;
						pedidoItem.xProd = item.xProd;
						pedidoItem.qProd = item.qProd;
						pedidoItem.vProd = item.vVenda;
						pedidoItem.vMerc = item.qProd * item.vVenda;
						pedido.PedidosItens.push(pedidoItem);
						pedido.Totalizar();
					});
				}
				pedido.Salvar();
			}
			alert("O pedido foi salvo com sucesso!");
			this.router.navigate(['/pedidos']);
	}

	// private ObterValidacao() {
	// 	const xCnpj = this.ObterDescricaoCampo('cnpj');
	// 	const xNome = this.ObterDescricaoCampo('nome');
	// 	return {
	// 		'cnpj': [
	// 			Utils.ObterMensagem('O', xCnpj, 'minlength', 11),
	// 			Utils.ObterMensagem('O', xCnpj, 'maxlength', 14),
	// 			Utils.ObterMensagem('O', xCnpj, 'pattern', 0, ' é inválido'),
	// 			Utils.ObterMensagem('O', xCnpj, 'required')
	// 		],
	// 		'nome': [
	// 			Utils.ObterMensagem('O', xNome, 'maxlength', 100),
	// 			Utils.ObterMensagem('O', xNome, 'minlength', 5),
	// 			Utils.ObterMensagem('O', xNome, 'pattern', 0, 'deve conter somente letras'),
	// 			Utils.ObterMensagem('O', xNome, 'required')
	// 		],
	// 		'email': [
	// 			Utils.ObterMensagem('O', this.ObterDescricaoCampo('email'), 'email', 0, ' é inválido')
	// 		]
	// 	};
	// }

	// private ObterDescricaoCampo(campo: string) {
	// 	return this.camposData?.Fields.find(x => x.name == campo)?.description ?? '';
	// }

	private compare(a: any, b: any, isAsc: any) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	private async ObterListaDePreco(filterValue: string = '') {
		await this.dataService.obterProdutos(filterValue).then(
			(data: any) => {
				data.forEach((item: any) => {
					item.Id = item.Id;
				});
				this.allData = data.map((preco: Partial<ProdutosDB> | undefined) => new ProdutoLista(preco));
				this.dataSource.data = this.getGroups(this.allData, this.groupByColumns);
			},
			(err: any) => console.log(err)
		);
	}
}