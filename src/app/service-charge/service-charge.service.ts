import { ServiceCharge } from './service-charge';
import { Page } from '../shared/page/page';

import { AuthService } from './../auth/auth.service';
import { Endpoints } from './../endpoints';
import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams, ResponseContentType } from '@angular/http';
import { ChargingGenerationFilter } from 'app/charging-generation/charging-generation-filter';
import { ServiceChargeClient } from './service-charge-client';

@Injectable()
export class ServiceChargeService {
	private headers = new Headers({ 'Content-Type': 'application/json' });

	constructor(private http: Http, private auth: AuthService) { }

	find(id: number | string) {
		let url = `${Endpoints.serviceChargeURL}/${id}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => ServiceCharge.fromData(response.json()));
	}

	list() {
		return this.http
			.get(`${Endpoints.serviceChargeURL}`)
			.toPromise()
			.then(response => {
				return ServiceCharge.fromListData(response.json());
			});
	}

	listPaged(filter: ChargingGenerationFilter, page: Page<ServiceCharge>) {

		let params = new URLSearchParams();
		params.appendAll(page.toURLSearchParams());
		params.appendAll(filter.toURLSearchParams());

		return this.http
			.get(`${Endpoints.serviceChargeURL}/paged`, {
				search: params
			})
			.toPromise()
			.then(response => {
				page.setResultFromServer(response.json());
				page.data = ServiceCharge.fromListData(page.data);
				return page;
			});
	}

	listByBatchOperation(batchOperationId: number | string) {
		let url = `${
			Endpoints.serviceChargeURL
			}/batch-operation/${batchOperationId}`;
		return this.http
			.get(url)
			.toPromise()
			.then(response => {
				if (!response.text()) {
					return null;
				}

				return ServiceCharge.fromListData(response.json());
			});
	}

	save(serviceCharges: ServiceCharge): Promise<ServiceCharge> {
		return this.create(serviceCharges);
	}

	delete(id: number | string): Promise<void> {
		let url = `${Endpoints.serviceChargeURL}/${id}`;
		return this.http
			.delete(url, {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => null);
	}

	private create(serviceCharges: ServiceCharge): Promise<ServiceCharge> {
		return this.http
			.post(Endpoints.serviceChargeURL, JSON.stringify(serviceCharges), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(res => ServiceCharge.fromData(res.json()));
	}

  approve(id: number | string): Promise<void> {
    let url = `${Endpoints.serviceChargeURL}/approve/${id}`;
    return this.http
      .put(url, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(() => null);
  }

  disapprove(id: number | string): Promise<void> {
    let url = `${Endpoints.serviceChargeURL}/disapprove/${id}`;
    return this.http
      .put(url, {
        headers: this.auth.appendOrCreateAuthHeader(this.headers)
      })
      .toPromise()
      .then(() => null);
  }

	hiddenChargesForEntry() {
		return Promise.resolve(
			this.auth.findParameterBoolean('CHARGING_ENTRY')
		);
	}

	/**
	 * Realiza pesquisa de cobran??as
	 * @param filter
	 */
	search(filter: ChargingGenerationFilter) {

		return this.http
			.post(`${Endpoints.serviceChargeURL}/search`, JSON.stringify(filter), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(response => {
				return ServiceCharge.fromListData(response.json());
			});
	}

	/**
	 * Gera a cobran??a para o filtro especificado
	 * @param filter
	 */
	generateCharging(filter: ChargingGenerationFilter) {

		return this.http
			.put(`${Endpoints.serviceChargeURL}/generateCharging`, JSON.stringify(filter), {
				headers: this.auth.appendOrCreateAuthHeader(this.headers)
			})
			.toPromise()
			.then(() => {
			});
	}

	/**
	   * Relat??rio de cobran??a anal??tico em PDF (byte)
	   * @param filter
	   */
	relatorioCobrancaAnalitico(filter: ChargingGenerationFilter): Promise<Blob> {

		let url = `${Endpoints.serviceChargeRelAnalitico}`;
		return this.http.post(url, JSON.stringify(filter), {
			headers: this.auth.appendOrCreateAuthHeader(this.headers),
			responseType: ResponseContentType.Blob
		}
		)
			.toPromise()
			.then(response => {
				return response.blob();
			});
	}

	/**
	   * Relat??rio de cobran??a anal??tico (para CSV)
	   * @param filter
	   */
	relatorioCobrancaAnaliticoLista(filter: ChargingGenerationFilter) {

		let url = `${Endpoints.serviceChargeRelAnaliticoLista}`;
		return this.http.post(url, JSON.stringify(filter), {
			headers: this.auth.appendOrCreateAuthHeader(this.headers),
		}).toPromise().then(response => {
			return ServiceChargeClient.fromListData(response.json());
		});
	}

	/**
	   * Relat??rio de cobran??a sint??tico em PDF (byte)
	   * @param filter
	   */
	relatorioCobrancaSintetico(filter: ChargingGenerationFilter): Promise<Blob> {

		let url = `${Endpoints.serviceChargeRelSintetico}`;
		return this.http.post(url, JSON.stringify(filter), {
			headers: this.auth.appendOrCreateAuthHeader(this.headers),
			responseType: ResponseContentType.Blob
		}
		)
			.toPromise()
			.then(response => {
				return response.blob();
			});
	}
}
