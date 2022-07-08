import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CreateservicesService } from '../../services/createservices.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'kt-bills-dialog',
  templateUrl: './bills-dialog.component.html',
  styleUrls: ['./bills-dialog.component.scss']
})
export class BillsDialogComponent implements OnInit {
  displayedColumns: string[] = ['id', 'amount', 'duedate', 'payment'];
  dataSource: any;
  id: string
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogComponent>, private api: CreateservicesService) {
    this.id = data.id;
    api.getPayments(this.id).subscribe((res: any) => {
      let orders = res.body.data.payment.orders;
      this.dataSource = new MatTableDataSource(orders);
      this.dataSource.data.forEach(element => {
        element.created_at = new Date(element.created_at).toLocaleDateString();
      })
    })
  }

  ngOnInit() {
    
  }
  close() {
    // this.dialogRef.close({ data:  this.date })
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
