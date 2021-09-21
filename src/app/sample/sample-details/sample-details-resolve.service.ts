import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';
import { SampleService } from '../sample.service';
import { Sample } from '../sample';

@Injectable()
export class SampleDetailsResolve implements Resolve<Sample> {
	constructor(
		private service: SampleService,
		private router: Router,
		private errorHandler: ErrorHandler
	) {}

	resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
		let id = route.params['id'];

		return this.service
			.find(id)
			.then(sample => {
				if (sample) {
					return sample;
				} else {
					this.router.navigate(['/sample']);
					return false;
				}
			})
			.catch(error => this.errorHandler.fromServer(error));
	}
}
