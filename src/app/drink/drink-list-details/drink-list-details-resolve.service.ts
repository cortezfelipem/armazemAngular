import { Injectable }             from '@angular/core';
import { Router, Resolve,
         ActivatedRouteSnapshot } from '@angular/router';
import { Observable }             from 'rxjs/Observable';
import {Drink} from '../drink';
import {DrinkService} from '../drink.service';


@Injectable()
export class DrinkDetailsResolve implements Resolve<Drink> {
  constructor(private service: DrinkService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    if (!route.params['id']) {
      this.router.navigate(['/drink']);
      return false;
    }
    let id = route.params['id'];
    return this.service.find(id).then(drink => {
      if (drink) {
        return drink;
      } else {
        this.router.navigate(['/drink']);
        return false;
      }
    });
  }
}
