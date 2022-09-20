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

	public dataSource = new MatTableDataSource<any | Group>([]);

	columns: any[];
	displayedColumns: string[];
	groupByColumns: string[] = [];
	allData!: any[];
	_allGroup!: any[];

	expandedProduto: any[] = [];
	expandedSubProduto: ProdutoLista[] = [];

	editRowId: number = -1

	@ViewChildren(MatInput, { read: ElementRef }) inputs: QueryList<ElementRef> | undefined;
	@ViewChild(MatSort) sort!: MatSort;

	public form!: FormGroup;

	cnpjMask = Utils.cnpjMask;
	foneMask(numberLength = 9) {
		return {
			guide: true,
			showMask: true,
			mask: numberLength == 9 ? Utils.fone9Mask : Utils.fone8Mask
		}
	}

	constructor(
		protected dataService: DataService,
		protected empresaService: EmpresaService,
		protected cepService: CepService,
		private formBuilder: FormBuilder
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

		this.form = this.formBuilder.group({
			nome: [''],
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
			fone: [''],
			pais: ['']
		});

		await this.ObterListaDePreco();

		// this.dataSource.filterPredicate =
		// 	(data: any, filter: string) => {
		// 		let retorno: boolean = true;
		// 		if (filter.length > 2 && data instanceof ProdutoLista) {
		// 			retorno = data.xProd.toLowerCase().includes(filter) ? true : false;
		// 		}
		// 		return retorno;
		// 	}
	}

	async applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		if (filterValue.length == 0 || filterValue.length > 2) {
			await this.ObterListaDePreco(filterValue);
			//this.dataSource.filter = filterValue.trim().toLowerCase();
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

	BuscarEmpresaIcon(cnpj?: string): void {
		cnpj = cnpj?.match(/\d/g)?.join('');
		if (typeof cnpj !== 'undefined' && cnpj !== null && cnpj !== '' && cnpj.length == 14) {
			this.empresaService.obterEmpresa(cnpj)
				.subscribe({
					next: (empresa: any) => {
						if (this) {
							this.form.patchValue({
								nome: empresa.company.name,
								fantasia: empresa.alias,
								cep: empresa.address.zip,
								endereco: empresa.address.street,
								numero: empresa.address.number,
								bairro: empresa.address.district,
								cidade: empresa.address.city,
								uf: empresa.address.state,
								me: empresa.company.size.text == "Microempresa",
								pais: empresa.address.country.name
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

	ObterEndereco() {

		let cep: string = this.form.controls['cep'].value.match(/\d/g)?.join('');

		if (typeof cep !== 'undefined' && cep !== null && cep !== '') { //  && this.form.controls['cep'].valid

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
						//this.focarNoNumero();
					},
					error: (err: any) => {
						alert(`Erro ao buscar o CEP: ${err.message}`);
					}
				});
		}
	}

	private compare(a: any, b: any, isAsc: any) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	}

	private async ObterListaDePreco(filterValue: string = '') {
		await this.dataService.obterProdutos(filterValue).then(
			(data: any) => {
				data.forEach((item: any) => { // , index: number
					item.Id = item.Id; // index + 1;
				});
				this.allData = data.map((preco: Partial<ProdutosDB> | undefined) => new ProdutoLista(preco));
				this.dataSource.data = this.getGroups(this.allData, this.groupByColumns);
			},
			(err: any) => console.log(err)
		);
	}
}