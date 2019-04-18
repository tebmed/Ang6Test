//  Child components process their own data, not the main-processor service.
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef} from '@angular/material';
import { AddEditFormComponent } from '../add-edit-form/add-edit-form.component';
import { HttpService } from '../../http.service';
import { MessagesService } from '../../services/messages-service/messages.service';
import { FormErrorsService } from '../../services/form-validation/form-errors.service';




@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  encapsulation: ViewEncapsulation.None
})


export class AddDataComponent {

  @ViewChild(AddEditFormComponent)
  public addDataForm: AddEditFormComponent;

  private dataUrl = 'api/mydata';
  private dbTable = 'mydata';

  constructor(
    private httpService: HttpService,
    public dialogRef: MatDialogRef<AddDataComponent>,  // Used by the html component.
    private messagesService: MessagesService,
    public formErrorsService: FormErrorsService
  ) { }


  reset() {
    this.addDataForm.addEditDataForm.reset();
  }

  //  Processes form data and sends it to the server and db.

  public save(addDataForm) {

    // right before we submit our form to the server we check if the form is valid
    // if not, we pass the form to the validateform function again. Now with check dirty false
    // this means we check every form field independent of whether it's touched.

    if (this.addDataForm.addEditDataForm.valid) {

    const enteredData = this.addDataForm.addEditDataForm.value;

    this.httpService.addRecord(this.dataUrl, enteredData)
      .subscribe(
        res => {
          this.success();
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.message);
          this.handleError(err);
        }
      );
    } else {
      this.addDataForm.formErrors = this.formErrorsService.validateForm(
        this.addDataForm.addEditDataForm,
        this.addDataForm.formErrors, false
      );
    }
    addDataForm.addEditDataForm.reset();
  }

  private success() {

    this.dialogRef.close(true);
  }

  private handleError(error) {
    this.messagesService.openDialog('Error addm1', 'Please check your Internet connection.');
  }

}


