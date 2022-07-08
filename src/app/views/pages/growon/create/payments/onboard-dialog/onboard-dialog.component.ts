import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kt-onboard-dialog',
  templateUrl: './onboard-dialog.component.html',
  styleUrls: ['./onboard-dialog.component.scss']
})
export class OnboardDialogComponent implements OnInit {
  date:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef: MatDialogRef<OnboardDialogComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close()
  }
  update() {
    this.dialogRef.close({ data:  this.date })
  }
}
