import { Injectable } from '@angular/core';

@Injectable()
export class UpdateDatatableService {

  constructor() { }


  // Remove the old item in Mat Table and replace with new at same index.
  // No need to refresh data from server.

  public updateDataTable (
    updatedData, recordId, idColumn, paginator, dataSource,
    formValue) {
    const dsData = dataSource.data;
    // Add the item id (member_id) back to data object for re-edits without refreshing from db.
    const itemId = idColumn + ': ' + recordId;
    formValue[idColumn] = recordId;


    // Find the data object's index number.
    const itemIndex = dsData.findIndex(obj => obj[idColumn] === recordId);
    // Update properties of item in a Mat Table row by deleting the selected item and adding data to same index.
    dataSource.data.splice(itemIndex, 1, formValue);
    dataSource.paginator = paginator;
  }

}