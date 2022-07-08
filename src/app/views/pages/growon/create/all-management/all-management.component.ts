import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CreateservicesService } from '../services/createservices.service';
import { Router } from '@angular/router';
import date from 'src/assets/plugins/formvalidation/src/js/validators/date';
import { EditAllManagementComponent } from '../all-management/edit-all-management/edit-all-management.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defaultRoles } from '../../roles-permission/default-roles';
import { LoadingService } from '../../../loader/loading/loading.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'kt-all-management',
  templateUrl: './all-management.component.html',
  styleUrls: ['./all-management.component.scss']
})
export class AllManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  title: string = 'Add management';
  managementForm: FormGroup;
  displayedColumns: string[] = ['name', 'mobile', 'gender', 'branch_id', 'school', 'schoolCode', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();
  managements: any[] = []
  isOwner: boolean;
  getAllManagementData: any;
  actionFlag: boolean = false;
  canEdit: boolean;
  schoolId: any;
  constructor(public apiService: CreateservicesService, public router: Router,
    private modalService: NgbModal, private formBuilder: FormBuilder, private loaderService: LoadingService) { }

  ngOnInit(): void {
    this.getAdmin();
    this.getallmanagements();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  getallmanagements() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let reqData;
    if (user.user_info[0].school_id) {
      id = localStorage.getItem('schoolId');
      this.isOwner=true;
      this.schoolId=localStorage.getItem('schoolId');
      // reqData = {
        // // "profile_type": "5fd2f18f9cc6537951f0b35c"
        // 'profile_type': defaultRoles.find(role => { return role.role_name == 'management' }).id,
        // "school_id": id
      // }
    }
    else {
      if(user.user_info[0].repository && user.user_info[0].repository.length){
        id= user.user_info[0].repository[0].id
        this.schoolId=user.user_info[0].repository[0].id
      }else{
        id= user.user_info[0]._id;
        this.schoolId=user.user_info[0]._id;
      }
        this.isOwner=false;
      // reqData = {
      //   // "profile_type": "5fd2f18f9cc6537951f0b35c"
      //   'profile_type': defaultRoles.find(role => { return role.role_name == 'management' }).id
      // }
    }

    this.getAllManagementData = reqData;
    let obj = {
      flag: "management"
    }
    if(this.isOwner){
      obj['school_id']=id
    }
    if (!this.isOwner) {
      this.apiService.getGlobalPrincipleAndManagementForRepo(obj).subscribe(
        (response: any) => {
          if (response && response.body && response.body.data) {
            this.managements = response.body.data;
            this.dataSource.data = this.managements;
          }
        }
      )
    } else {
      this.apiService.getPrincipleAndManagementForRepo(obj, id).subscribe(
        (response: any) => {
          if (response && response.body && response.body.data) {
            this.managements = response.body.data;
            this.dataSource.data = this.managements;
          }
        }
      )
    }
    // this.apiService.getallmanagement(this.getAllManagementData).subscribe((data: any) => {
    //   this.managements = data.body.data;
    //   this.dataSource.data = this.managements;
      

    // })

  }
  
  deactivateAccount(element) {
    let obj = {
      flag: "management"
    }
    if (element.activeStatus) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        size: "sm",
      });
      modalRef.componentInstance.activeStatus = element.activeStatus;
      modalRef.result.then((result) => {
        this.loaderService.show();
        if (result) {
          let obj = {
            activeStatus: false
          }
          this.apiService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              this.getallmanagements();
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
        } else {
          this.loaderService.show();
          let obj = {
            activeStatus: true
          }
          this.apiService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              this.getallmanagements();
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
            activeStatus: true
          }
          this.apiService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              this.getallmanagements();
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
        } else {
          this.loaderService.show();
          let obj = {
            activeStatus: false
          }
          this.apiService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              this.getallmanagements();
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

  updateManagement(managements: any) {
    const modalRef = this.modalService.open(EditAllManagementComponent, { size: 'xl' , backdrop : 'static'});
    modalRef.componentInstance.managements = managements;
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.getallmanagements(); // Refresh Data in table grid
      }
    }, (reason) => {
    });
  }

  deleteUser(row) {
    this.loaderService.show();
      let data = {
        userId:row._id,
        isGlobal:this.isOwner ? false: true,
        isStudent:false,
        repositoryId:this.schoolId
      }
      this.apiService.deleteUser(data).subscribe((res) => {
        this.getallmanagements();// call get principal api based on global or school level
        this.loaderService.hide();
      }, err => {
        this.loaderService.hide();
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      })
  }


  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    // defaultRoles.find(role => { return role.role_name == 'admin' })
    if (user.user_info[0].profile_type.role_name == 'admin') {
      this.isOwner = false;
      this.actionFlag = false;
      this.canEdit = false;
    }
    else if (user.user_info[0].profile_type.role_name == 'school_admin') {
      this.actionFlag = true;
      this.isOwner = true
      this.canEdit = true;
    } else {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = false;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
