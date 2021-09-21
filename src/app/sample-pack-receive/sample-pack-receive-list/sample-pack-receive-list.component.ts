import { Component, OnInit, OnDestroy } from '@angular/core';

import { Notification } from '../../shared/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { Endpoints } from '../../endpoints';
import {
	Headers,
	Http,
	ResponseContentType,
	URLSearchParams
} from '@angular/http';
import { SamplePackReceiveService } from '../sample-pack-receive.service';
import {SamplePack} from "../../sample-pack/sample-pack";
import {SamplePackStatus} from "../../sample-pack/sample-pack-status";

@Component({
	selector: 'app-sample-pack-receive-list',
	templateUrl: './sample-pack-receive-list.component.html'
})
export class SamplePackReceiveListComponent implements OnInit, OnDestroy {
	loading: boolean;
	error: boolean;
	deleteConfirm: ModalManager = new ModalManager();

	page: Page<SamplePack> = new Page<SamplePack>();
	search: Search = new Search();
	selectedStatus: string;
	listStatus: Array<SamplePackStatus> = [];

	constructor(
		private samplePackService: SamplePackReceiveService,
		private errorHandler: ErrorHandler,
		private http: Http,
		private logger: Logger
	) { }

	ngOnInit() {
		this.listStatus = SamplePackStatus.list();

		this.loadList();
		this.page.changeQuery.subscribe(() => {
			this.loadList();
		});
		this.search.subscribe(() => {
			this.loadList();
		});
	}

	loadList() {
		this.error = false;
		this.loading = true;
		this.samplePackService
			.listPaged(this.search.value, this.selectedStatus, this.page)
			.then(() => {
				this.loading = false;
			})
			.catch(error => this.handleError(error));
	}

	detalhes(id: string | number) {
		console.log('detalhes ' + id);
	}

	ngOnDestroy() {
		this.page.changeQuery.unsubscribe();
		this.search.destroy();
	}

	handleError(error) {
		this.error = true;
		this.loading = false;
		return this.errorHandler.fromServer(error);
	}

	printSendProtocol(id: string): Promise<void> {
		let params = new URLSearchParams();
		params.append('samplePackId', id);
		return this.http
			.get(Endpoints.reportProtocolSamplePackUrl, {
				responseType: ResponseContentType.Blob,
				search: params
			})
			.toPromise()
			.then(response => {
				let url = window.URL.createObjectURL(response.blob());
				window.open(url);
			}).catch(error => this.handleError(error));
	}
}
