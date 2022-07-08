import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateservicesService } from '../../services/createservices.service';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BillsDialogComponent } from '../bills-dialog/bills-dialog.component';
import { OnboardDialogComponent } from '../onboard-dialog/onboard-dialog.component';

@Component({
  selector: 'kt-activate-billing',
  templateUrl: './activate-billing.component.html',
  styleUrls: ['./activate-billing.component.scss']
})
export class ActivateBillingComponent implements OnInit {
  displayedColumns: string[] = ['name', 'contact', 'code', 'view', 'activate', 'onboarded', 'status'];
  dataSource: any;
  schools: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {

  }

  constructor(private api: CreateservicesService, private dialog: MatDialog) {
    this.getSchools()
  }

  ngOnInit() {
  }

  getSchools() {
    this.api.getallinstitutenew(null, true).subscribe((res: any) => {
      this.schools = res.body.data;
      this.schools.forEach((element:any) => {
        element.onboard ? element.onboard = new Date(element.onboard).toLocaleDateString() : ''
        // element.onboard = element.onboard.
      });
      this.dataSource = new MatTableDataSource(this.schools)
      this.dataSource.paginator = this.paginator;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  open(schoolName: any, id: any, i: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      hasBackdrop: false,
      data: { name: schoolName, id: id },
      width: '600px',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.updateDueDate(result.data, id, i);
    });
  }


  updateDueDate(date: any, id: string, active: number) {
    if (!active) {
      const utcDate = new Date(date).toISOString();
      let data = {
        activateDate: utcDate
      }
      this.api.activatePayment(data, id).subscribe((res: any) => {
        console.log("Response", res);
        this.getSchools()
      })
    } else {
      alert('Already Activated')
    }

  }

  getOrders(id: string) {
    const dialogRef = this.dialog.open(BillsDialogComponent, {
      hasBackdrop: true,
      data: { id: id },
      width: '800px',
      height: '400px',
    });

  }

  onboardPopup(schoolName: any, id: any) {
    const dialogRef = this.dialog.open(OnboardDialogComponent, {
      hasBackdrop: false,
      data: { name: schoolName, id: id },
      width: '600px',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {

      let date = new Date(result.data)
      this.api.updateSchool({ onboard: date.toISOString() }, id).subscribe((res: any) => {
        console.log(res)
        if(res.status == 201){
          this.getSchools()
        }
      })
    });
  }

}
