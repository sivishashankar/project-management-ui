import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {
  static dateValidator(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, 'YYYY/MM/DD', true).isValid()) {
      return { 'dateValidator': true };
    }
    return null;
  }
}