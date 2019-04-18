

import { Injectable } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';

import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

@Injectable()
export class ErrorMatcherService implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export const errorMessages: { [key: string]: string } = {
  required: 'This field is required',
  middle_initial: 'Only one letter allowed',
  email: 'Invalid email address',
};



