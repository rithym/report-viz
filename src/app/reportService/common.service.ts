import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerPopupComponent } from '../spinner-popup/spinner-popup.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private dialog: MatDialog,) { }

  start(message?: any): MatDialogRef<SpinnerPopupComponent> {

    const dialogRef = this.dialog.open(SpinnerPopupComponent, {
      disableClose: true,
      // height:'200px',
      // width:
      data: { message: message == '' || message == undefined ? "Loading..." : message },
    });
    return dialogRef;
  };

  stop(ref?: MatDialogRef<SpinnerPopupComponent>) {
    ref?.close();
  }
  
}
