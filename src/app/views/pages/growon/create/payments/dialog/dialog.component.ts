import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kt-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  date:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string }, private dialogRef: MatDialogRef<DialogComponent>) { 
  }

  ngOnInit() {
    let currDate =  new Date()
    let currMonth = currDate.getMonth() < 9 ? `0${currDate.getMonth()}` : currDate.getMonth()
    let currYear = currDate.getFullYear()
    this.date = `${currYear}-${currMonth}`
    console.log(this.date)
  }

  close() {
    this.dialogRef.close()
  }
  update() {
    console.log(`${this.date}-01`)
    this.dialogRef.close({ data:  `${this.date}-01` })
  }
}
