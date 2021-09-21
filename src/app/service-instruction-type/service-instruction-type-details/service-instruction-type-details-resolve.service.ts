import { ServiceInstructionType } from './../service-instruction-type';
import { ServiceInstructionTypeService } from './../service-instruction-type.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from 'app/shared/errors/error-handler';

@Injectable()
export class ServiceInstructionTypeDetailsResolve implements Resolve<ServiceInstructionType> {
  constructor(private service: ServiceInstructionTypeService, private router: Router, private errorHandler: ErrorHandler) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    let id = route.params['id'];

    return this.service.find(id).then(serviceInstructionType => {
      if (serviceInstructionType) {
        return serviceInstructionType;
      } else {
        this.router.navigate(['/service-instruction-type']);
        return false;
      }
    }).catch((error) => this.errorHandler.fromServer(error));
  }
}
