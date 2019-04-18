//  Child components process their own data, not the main-processor service.

import { Component, AfterViewInit, Inject, ViewChild, ViewEncapsulation } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import { HttpService } from '../../http.service';
import { DataModel } from '../data.model';
import { AddEditFormComponent } from '../add-edit-form/add-edit-form.component';
import { UpdateDatatableService } from '../../services/update-datatable.service';

import { MessagesService } from '../../services/messages-service/messages.service';
import { FormErrorsService } from '../../services/form-validation/form-errors.service';



@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  encapsulation: ViewEncapsulation.None
})


export class EditDataComponent implements AfterViewInit {

  private dataUrl = 'api/mydata';
  private formValue: DataModel;

  private recordId: number;
  private idColumn;
  private paginator;
  private dataSource;


  // This is a form group from FormBuilder.
  @ViewChild(AddEditFormComponent) 
  private addEditForm: AddEditFormComponent;



  constructor(
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // Used in modal for close()
    public dialogRef: MatDialogRef<EditDataComponent>,        
    private updateDatatableService: UpdateDatatableService,
    private messagesService: MessagesService,
    public formErrorsService: FormErrorsService,
  ) {
  }



  // ---- GET DATA BY ID ----


// Need to load the data after the form is rendered so ngOnInit didn't work.
// setTimeout is a hack to avoid ExpressionChangedAfterItHasBeenCheckedError

  ngAfterViewInit() {
    setTimeout(() => {
      this.fetchRecord();
    }, 200);
  }

  public fetchRecord() {

    this.recordId = this.data.recordId;
    this.idColumn = this.data.idColumn;
    this.paginator = this.data.paginator;
    this.dataSource = this.data.dataSource;

    // Display the data retrieved from the data model to the form model.
    this.httpService.getRecordById(this.dataUrl, this.recordId)
        .subscribe(data => {
            this.fillForm(data);
          },
          (err: HttpErrorResponse) => {
            console.log(err.error);
            console.log(err.message);
            this.handleError(err);
          });
  }



  // Populate the form, called above in fetchRecord().

  private fillForm(parsedData) {
    this.addEditForm.addEditDataForm.setValue({
      id: parsedData.id,
      originalTitle: parsedData.originalTitle,
      startYear: parsedData.startYear,
      genres: parsedData.genres,
    });
    this.existingTitle(); // If existing title, don't validate.
  }



// ---- UPDATE ----  Called from edit-Data.component.html

  public update(formValue) {
    console.log(formValue);
    if (this.addEditForm.addEditDataForm.valid) {
      this.httpService.updateRecord(this.dataUrl, formValue)
      .subscribe(
        result => {
          // Update the table data view for the changes.
          this.updateDatatableService.updateDataTable(
            result, this.recordId, this.idColumn, this.paginator, this.dataSource, formValue);
          this.success();
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.message);
          this.handleError(err);
        }
      );
    }
  }

  // Check if the user_name field has a name already and set
  //   the unique user name validation field to false so
  //   it doesn't trigger validation until changed.

  private existingTitle() {
    if (this.addEditForm.addEditDataForm.controls['originalTitle']
        .value !== null) {
      this.addEditForm.inDatabase = false;
    } else {
      return null;
    }
  }


  // ---- UTILITIES ----


  private reset() {
    this.addEditForm.addEditDataForm.reset();
  }

  private success() {
    this.messagesService.openDialog('Success', 'Database updated as you wished!');
    this.dialogRef.close(true)
  }

  private handleError(error) {
    this.messagesService.openDialog('Error em1', 'Please check your Internet connection.');
  }
}



