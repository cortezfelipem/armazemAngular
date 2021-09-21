import { Notification } from './../../shared/notification/notification';
import { ErrorHandler, ModalManager, Search } from '../../shared/shared.module';
import { Logger } from '../../shared/logger/logger';
import { Page } from '../../shared/page/page';
import { Component } from '@angular/core/src/metadata/directives';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormGroup } from '@angular/forms/src/model';
import { Masks } from 'app/shared/forms/masks/masks';
import { FormBuilder } from '@angular/forms/src/form_builder';
import { CustomValidators } from 'app/shared/forms/validators/custom-validators';
import { PackTypeService } from 'app/pack-type/pack-type.service';
import { PackType } from 'app/pack-type/pack-type';
import { DailyEntryService } from 'app/report/daily-entry/daily-entry.service';
import { DailyEntry } from 'app/report/daily-entry/daily-entry';
import { DateTimeHelper } from 'app/shared/globalization/date-time-helper';
import { Validators } from '@angular/forms/src/validators';
import { SaleSummaryService } from 'app/report/sale-summary/sale-summary.service';

@Component({
  selector: 'sale-summary',
  templateUrl: './sale-summary.component.html'

})
export class SaleSummaryComponent implements OnInit {
  loading: boolean = false;
  form: FormGroup;
  sellCode: string;
  constructor(
    private errorHandler: ErrorHandler,
    private logger: Logger,
    private formBuilder: FormBuilder,
    private saleSummaryService: SaleSummaryService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  submit() {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].markAsDirty();
    });
    if (!this.form.valid) {
      return;
    }
    this.saleSummaryReport();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      'sellCode': [this.sellCode || '', Validators.required],
    });
  }

  saleSummaryReport() {
    this.loading = true;

    let blob: Promise<Blob> = this.saleSummaryService.find(this.form.value.sellCode);
    blob.then((b) => {
      if (b.size === 0) {
        Notification.error('Não foi encontrado informações para abrir o relatório!');
      }else {
        let urlReport = window.URL.createObjectURL(b);
        window.open(urlReport);
      }
      this.loading = false;
    });
  }
}
