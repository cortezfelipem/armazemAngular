import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ClassificationVersion } from '../classification-version';
import { ClassificationService } from '../classification.service';
import { ErrorHandler } from '../../shared/errors/error-handler';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClassificationDetailsResolve implements Resolve<ClassificationVersion> {

	constructor(
		private service: ClassificationService,
		private router: Router,
		private errorHandler: ErrorHandler
  	) {}
  
  	resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
		if (!route.params['id']) {
			const classification = ClassificationVersion.fromData();
			return Promise.resolve(classification);
		}

		const id = route.params['id'];

		return this.service
			.findVersion(id)
			.then(classification => {
				if (classification) {
					return classification;
				} else {
					this.router.navigate(['/classification']);
					return false;
				}
			})
			.catch(error => this.errorHandler.fromServer(error));
	}

}
