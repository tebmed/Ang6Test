import { Component, ViewChild, Injectable} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormControl } from '@angular/forms';

import { merge, Subject, Observable } from 'rxjs';
import { startWith, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { MatDialog } from '@angular/material';

import { DataModel } from './data.model';
import { HttpService } from '../http.service';

import { ConfirmService } from '../services/confirm-dialog/confirm.service';
import { MessagesService } from '../services/messages-service/messages.service';

import { AddDataComponent } from './add-data/add-data.component';
import { EditDataComponent } from './edit-data/edit-data.component';
import { countries } from '../../server/countries-list';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls : ['./data.component.scss']
})


export class DataComponent {
    

private idColumn = 'id';
private dbTable = 'mydata';
private dataUrl = 'api/mydata';


private dsData: any;

// dataSource: MatTableDataSource<DataModel>;
@ViewChild(MatPaginator) paginator: MatPaginator;

  public dataLength: number;

  private addDataComponent = AddDataComponent;
  private editDataComponent = EditDataComponent;

  private idArray: number[] = [];  // Create array for checkbox selection in table.
  private dataArray = [];

 public displayedColumns = [
      'originalTitle',
      'startYear',
      'genres',
      'options'
  ];

  public dataSource = new MatTableDataSource;

 // For the countries search dropdown.
  public countries = countries;
  public country: string;
  public countriesControl = new FormControl('');

  // For last name query
  public searchTerm$ = new Subject<string>();
  public searchTermYear$ = new Subject<string>();

  constructor(
    private httpService:  HttpService,
    public dialog: MatDialog,
    private confirmService: ConfirmService,
    private messagesService: MessagesService,
    ) {

      this.httpService.getAllRecords(this.dataUrl)
      .subscribe(data => {
        this.dataLength = data.length;
        this.dataSource.data = data;
      });
      
    // ------  SEARCH -------------
  
    this.httpService.nameSearch(this.searchTerm$)
    .subscribe(data => {
        this.dataLength = data.length;
        this.dataSource.data = data;
      });

         this.httpService.yearSearch(this.searchTermYear$)
    .subscribe(data => {
        this.dataLength = data.length;
        this.dataSource.data = data;
      });
    
    }


  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }




  // ----------------- GET ALL ------------------

  //  This works fine when multiple queries used.
  public getAllRecords(): any {
      this.httpService.getAllRecords(this.dataUrl)
      .subscribe(data => {
        this.dataLength = data.length;
        this.dataSource.data = data;
      });
    }
 
  // ----------- EDIT & UPDATE --------------

  public editRecord(recordId) {
    console.log(recordId);
    this.dialog.open(this.editDataComponent, {
      data: {recordId: recordId, idColumn: this.idColumn, paginator: this.paginator, dataSource: this.dataSource}
    });
  }



// --------------- DELETE ------------------

  public deleteRecord(recordId) {
    const dsData = this.dataSource.data;

    // For delete confirm dialog in deleteItem to match the db column name to fetch.
    const name1 = 'originalTitle';
    const record = dsData.find(obj => obj[this.idColumn] === recordId);
    const name = 'Delete ' + record[name1] +'?';

    const url = `${this.dataUrl}/${recordId}`;

    // Call the confirm dialog component
    this.confirmService.confirm(name, '').pipe(
      switchMap(res => {if (res === true) {
        console.log('url: ', url);
        return this.httpService.deleteRecord(url);
      }}))
      .subscribe(
        result => {
          this.success();
          // Refresh DataTable to remove row.
          this.deleteRowDataTable (recordId, this.idColumn, this.paginator, this.dataSource);
        },
        (err: HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.message);
          this.messagesService.openDialog('Error', 'Delete did not happen.');
        }
      );
  }

// Remove the deleted row from the data table. Need to remove from the downloaded data first.
  private deleteRowDataTable (recordId, idColumn, paginator, dataSource) {
    this.dsData = dataSource.data;
    const itemIndex = this.dsData.findIndex(obj => obj[idColumn] === recordId);
    dataSource.data.splice(itemIndex, 1);
    dataSource.paginator = paginator;
  }



  

  //  ---- LAST NAME INCREMENTAL QUERY IN CONSTRUCTOR -------



  // -------------- SELECT BOX ------------------


  // Called each time a checkbox is checked in the mat table.
  public selectData(selectedData) {
    // push the id's into an array then call it with the button.
    return this.idArray.push(selectedData);
  }
  //   |
  //   |
  //   |
  //   V

  // Called by the Show Selected button.
  public getAllSelected() {
    this.dataArray = [];
    const tempArray = [];
    const ds = this.dataSource.data;
    const property = 'id';

    this.idArray.forEach(function (id, i) {

      // Need to match ids in idArray with dataSource.data.
       const dataId: number = id;  // Extracts data id from selection array.

      // Search dataSource for each data_id and push those selected into a new data object.
      ds.forEach(function (data, index) {

        if (ds[index][property] === dataId) {
          tempArray.push(data);
        }
      });
    });

    this.idArray = []; // Empty the array for next query.
    this.dataArray = tempArray;
    this.paginator.pageIndex = 0;
    this.dataSource.data = this.dataArray;
  }

// -----------  UTILITIES ------------------


  private success() {
    // this.messagesService.openDialog('Success', 'Database updated as you wished!');
  }

  private handleError(error) {
    this.messagesService.openDialog('Error', 'No database connection.');
  }




}
