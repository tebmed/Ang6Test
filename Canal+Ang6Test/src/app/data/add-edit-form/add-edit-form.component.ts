import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ErrorMatcherService, errorMessages } from '../../services/form-validation/form-validators.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Used for importing lists from the html.
import { UniqueNameService } from '../../services/unique-name.service';



@Component({
  selector: 'app-add-edit-form',
  templateUrl: './add-edit-form.component.html',
  encapsulation: ViewEncapsulation.None
})



export class AddEditFormComponent implements OnInit {

  public addEditDataForm: FormGroup;

  public matcher = new ErrorMatcherService();
  errors = errorMessages;  // Used on form html.


  // Used on form html.
  public inDatabase;


  public formErrors = {
    id: '',
    originalTitle: '',
    startYear: '',
    genres: '',
  };



  constructor(
    private fb: FormBuilder,
    public uniqueNameService: UniqueNameService,
  ) {
    // Conditional that monitors testing for unique name by service.
    this.uniqueNameService.inDatabase.subscribe(result => {
      this.inDatabase = result;  // When set to true it triggers the message.
      return result === true ? this.isTaken() : null;
    });
  }

  ngOnInit() {
    this.createForm();
    // Set the initial user name validation trigger to false - no message.
    this.inDatabase = this.uniqueNameService.inDatabase.value;
  }


  // The reactive model that is bound to the form.

  private createForm() {
    this.addEditDataForm = this.fb.group({
      id: [''],
      originalTitle: ['', Validators.required],
      startYear: ['', Validators.required],
      genres: ['', Validators.required],
    });
  }



  // This runs if inDatabase = true shows a match.  
  // See template and subscription in constructor.

  private isTaken() {

    // Remove the "already in database" message after some time.
    setTimeout (() => {
      this.inDatabase = false;

      // Clear the field to reset validation and prepare for next attempt.
      this.addEditDataForm.controls['id']
      .setValue(null);
    }, 3000);

  }

  
}



