import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-spinner-popup',
  templateUrl: './spinner-popup.component.html',
  styleUrls: ['./spinner-popup.component.scss']
})
export class SpinnerPopupComponent {
  constructor(public dialogRef: MatDialogRef<SpinnerPopupComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
