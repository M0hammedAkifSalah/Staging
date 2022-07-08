import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateservicesService } from '../services/createservices.service'
import { environment } from '../../../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component';

declare var Razorpay: any;

@Component({
  selector: 'kt-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'amount', 'duedate', 'payment','invoice'];
  dataSources: any;
  school: any;
  @ViewChild(MatPaginator, { read: '', static: true }) paginator: MatPaginator;
  constructor(private dialog: MatDialog, private api: CreateservicesService) {


    this.getSchool();
  }

  ngOnInit() {
   this.getPayments();
  this.loadScript();
  }

  ngAfterViewInit(): void {
    // this.dataSources.paginator = this.paginator;
  }


  private loadScript() {
    let rpScript = document.createElement("script");
    rpScript.type = "text/javascript";
    rpScript.async = true;
    rpScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(rpScript);
  }


  getPayments(){
    this.api.getPayments(localStorage.getItem('schoolId')).subscribe((res: any) => {
      console.log('Payment Response', res)
      this.dataSources = new MatTableDataSource(res.body.data.payment.orders);
      this.dataSources.data.forEach(element => {
        element.created_at = new Date(element.created_at).toLocaleDateString();
      })
      this.dataSources.paginator = this.paginator;
      setTimeout(() => {
        this.dataSources.paginator = this.paginator;
      }, 1000);

    })
  }
  getSchool() {
    this.api.getSchool(localStorage.getItem('schoolId')).subscribe((res: any) => {
      console.log('School', res.body.data[0])
      this.school = res.body.data[0];
    })
  }

  payNow = async (order_id: string) => {
    var options = {
      "key": environment.rzp_key,
      "name": localStorage.getItem('schoolname'),
      "order_id": order_id,
      "handler": async (response: any) => {
        try {
          console.log('rp res', response)
          let data = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            school_id: localStorage.getItem('schoolId')
          }
          this.checkPayment(data);
        } catch (error) {
          alert('PAYMENT FAILED')
          console.log(error)
        }
      },
      "prefill": {
        "name": localStorage.getItem('schoolname'),
        "email": this.school.email,
        "contact": this.school.contact_number,
      },
      "notes": {},
      "theme": {
        "color": "yellow"
      }
    };
    setTimeout(() => {
      var rzp1 = new Razorpay(options);
      rzp1.open();
    }, 1000)

  }

  checkPayment(data: any) {
    this.api.verifyPayment(data).subscribe((res: any) => {
      if(res.status === 200 ){
        setTimeout(()=>{
          this.getPayments();
        },500)
      }
      console.log('Payment Verified', res)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSources.filter = filterValue.trim().toLowerCase();
  }

  invoiceDialog(element?: any) {
    const dialogRef = this.dialog.open(InvoiceDialogComponent, {
      hasBackdrop: true,
      data: {
        order: element,
        school: this.school
      },
      width: '800px',
      // height: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
    });
  }
}
