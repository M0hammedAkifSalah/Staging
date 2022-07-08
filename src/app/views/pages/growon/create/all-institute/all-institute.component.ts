import { LoadingService } from './../../../loader/loading/loading.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import date from 'src/assets/plugins/formvalidation/src/js/validators/date';
import { LearningService } from '../../learning/services/learning.service';
import { Router } from '@angular/router';
import { EditAllInstituteComponent } from '../all-institute/edit-all-institute/edit-all-institute.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import id from 'src/assets/plugins/formvalidation/src/js/validators/id';
import { CreateservicesService } from '../services/createservices.service';
import { defaultRoles } from '../../roles-permission/default-roles';
import { UpdateUserModalComponent } from '../../roles-permission/modals/update-user-modal/update-user-modal.component';
import { EditSchoolAdminComponent } from './edit-school-admin/edit-school-admin.component';
import { SchoolDetails } from '../../model/schooldetails.model';
import { DataResponse } from '../../model/dataresponse.model';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'kt-all-institute',
  templateUrl: './all-institute.component.html',
  styleUrls: ['./all-institute.component.scss']
})
export class AllInstituteComponent implements OnInit {
  //randomPass: any;
  canEdit: boolean;
  //isLoaded: boolean = false;
  //users = [];
  constructor(
    public apiService: CreateservicesService, public router: Router,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private loaderService:LoadingService,
  ) { }
  //title: string = 'Add School';
  //schoolForm: FormGroup;
  displayedColumns: string[] = ['schoolName', 'address', 'city', 'contact_number', 'schoolCode', 'email', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  schools: SchoolDetails[] = []
  isOwner: boolean = false


  @ViewChild(MatPaginator, { read: '', static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { read: '', static: true }) sort: MatSort;
  ngOnInit(): void {
    this.getallinstitutes();
    //this.getAllUsers();
    this.getAdmin();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  getallinstitutes() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = localStorage.getItem('schoolId');
      console.log(id)
      this.isOwner = true;
    } else {
      this.isOwner = false;
    }

    this.apiService.getallinstitutenew(id, true).subscribe((res: any) => {
      if (res.body.data.length > 0) {
        this.schools = res.body.data;
        this.dataSource = new MatTableDataSource<SchoolDetails>(this.schools);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
        this.loaderService.hide();
      }else{
        this.loaderService.hide();
      }
    },
    error=>{
      this.loaderService.hide();
    }
    )

  }


  //Update
  updateSchool(schools: SchoolDetails) {
    const modalRef = this.modalService.open(EditAllInstituteComponent, { size: 'xl' });
    modalRef.componentInstance.school = schools;
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.getallinstitutes(); // Refresh Data in table grid
      }
    }, (reason) => {
    });
  }

  deactivateAccount(element) {
    if (element.activeStatus) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        size: "sm",
      });
      modalRef.componentInstance.activeStatus = element.activeStatus;
      modalRef.result.then((result) => {
        this.loaderService.show();
        if (result) {
          let obj = {
            repositoryId:element._id,
            activeStatus: false
          }
          this.apiService.deactiveActiveSchool(obj).subscribe(
            (response: any) => {
              this.getallinstitutes();
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
        } else {
          this.loaderService.show();
          let obj = {
            repositoryId:element._id,
            activeStatus: true
          }
          this.apiService.deactiveActiveSchool( obj).subscribe(
            (response: any) => {
              this.getallinstitutes();
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
        }
      })
      this.loaderService.hide();
    } else {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        size: "sm",
      });
      modalRef.componentInstance.activeStatus = element.activeStatus;
      modalRef.result.then((result) => {
        if (result) {
          let obj = {
            repositoryId:element._id,
            activeStatus: true
          }
          this.apiService.deactiveActiveSchool(obj).subscribe(
            (response: any) => {
              this.getallinstitutes();
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
        } else {
          this.loaderService.show();
          let obj = {
            repositoryId:element._id,
            activeStatus: false
          }
          this.apiService.deactiveActiveSchool(obj).subscribe(
            (response: any) => {
              this.getallinstitutes();
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
        }
      })
    }
  }





  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;



    if (user.user_info[0].profile_type.role_name == 'admin') {
      this.canEdit = true;
    }
    else if (user.user_info[0].profile_type.role_name == 'school_admin') {

      this.canEdit = true;
    }

    else {
      this.canEdit = false;
    }
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
