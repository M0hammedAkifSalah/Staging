import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
  styleUrls: ['./invoice-dialog.component.scss']
})
export class InvoiceDialogComponent implements OnInit {
  amount: number;
  gstAmount: number;
  school: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>) {
    console.log('data', data)
    data.order.due_date = new Date(data.order.due_date).toLocaleString().split(',').splice(0, 1)
    data.order.amount = Math.floor(data.order.amount)
    this.school = data.school
    this.getAmount()
  }


  ngOnInit() {
  }
  close() {
    this.dialogRef.close()
  }

  getAmount() {
    this.amount = Math.floor(this.data.order.no_of_student * 10);
    this.gstAmount = Math.floor(this.data.order.amount - this.amount)
  }

}
