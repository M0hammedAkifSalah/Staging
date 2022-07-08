import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LearningService } from '../../learning/services/learning.service';
import { Router } from '@angular/router';
import date from 'src/assets/plugins/formvalidation/src/js/validators/date';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defaultRoles } from '../../roles-permission/default-roles';
import { UpdatePrincipleModalComponent } from '../../roles-permission/modals/update-principle-modal/update-principle-modal.component';
import { LoadingService } from '../../../loader/loading/loading.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { CreateservicesService } from '../services/createservices.service';
import { PrincipleComponent } from '../principle/principle.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'kt-all-principle',
  templateUrl: './all-principle.component.html',
  styleUrls: ['./all-principle.component.scss']
})
export class AllPrincipleComponent implements OnInit {

  constructor(private apiService: LearningService, public router: Router,
    private modalService: NgbModal, private formBuilder: FormBuilder, private loaderService: LoadingService,
    private createService: CreateservicesService, private cdr: ChangeDetectorRef,

  ) { this.principleForm = this.createFormGroup() }

  isOwner: boolean;
  canEdit: boolean;
  title: string = 'Add principal';
  principleForm: FormGroup;
  principles: any[] = []
  displayedColumns: string[] = ['name', 'mobile', 'gender', 'branch_id', 'school', 'schoolCode', 'status', 'action'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  getPrincipleData;
  actionFlag: boolean = false;
  schoolId: any

  ngOnInit(): void {
    this.getAdmin();
    this.getallprinciples();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  getallprinciples() {


    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let reqData;
    if (user.user_info[0].school_id) {
      id = localStorage.getItem('schoolId');
      this.schoolId = localStorage.getItem('schoolId');
      this.isOwner = true;
      // reqData = {
      //   // "profile_type": "5fd2f18f9cc6537951f0b35c"
      //   'profile_type': defaultRoles.find(role => { return role.role_name == 'principle' }).id,
      //   "school_id": id
      // }
    }
    else {

      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        id = user.user_info[0].repository[0].id
        this.schoolId = user.user_info[0].repository[0].id
      } else {
        id = user.user_info[0]._id;
        this.schoolId = user.user_info[0]._id;
      }
      this.isOwner = false;
      // id = user.user_info[0]._id;
      // reqData = {
      //   // "profile_type": "5fd2f18f9cc6537951f0b35c"
      //   'profile_type': defaultRoles.find(role => { return role.role_name == 'principle' }).id
      // }
    }
    /* let data = {
      // "profile_type": "5fd2f18f9cc6537951f0b35c"
      'profile_type': defaultRoles.find(role => { return role.role_name == 'teacher' }).id,
      "school_id": id
    } */
    this.getPrincipleData = reqData;
    let obj = {
      flag: "principal"
    }
    if (this.isOwner) {
      obj['school_id'] = id
    }
    if (!this.isOwner) {
      this.createService.getGlobalPrincipleAndManagementForRepo(obj).subscribe(
        (response: any) => {
          if (response && response.body && response.body.data) {
            this.principles = response.body.data;
            this.dataSource.data = this.principles;
          }
        }
      )
    } else {
      this.createService.getPrincipleAndManagementForRepo(obj, id).subscribe(
        (response: any) => {
          if (response && response.body && response.body.data) {
            this.principles = response.body.data;
            this.dataSource.data = this.principles;
          }
        }
      )
    }
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
            activeStatus: false
          }
          this.createService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              this.getallprinciples();
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
          this.loaderService.hide();
        } else {
          this.loaderService.show();
          let obj = {
            activeStatus: true
          }
          this.createService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              this.getallprinciples();
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
          this.loaderService.hide();
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
          this.createService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              this.getallprinciples();
              this.loaderService.hide();
            }, error => {
              this.loaderService.hide();
            }
          )
        } else {
          this.loaderService.show();
          let obj = {
            activeStatus: false
          }
          this.createService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              this.getallprinciples();
              this.loaderService.hide();
            }, error => {
              this.loaderService.hide();
            }
          )
        }
      })
    }
  }


  //Update
  updatePrinciple(principles) {
    console.log(principles)
    const modalRef = this.modalService.open(PrincipleComponent, { size: 'xl' ,backdrop:'static'});
    modalRef.componentInstance.user = principles;
    modalRef.componentInstance.updateFlag = true;
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.getallprinciples(); // Refresh Data in table grid
      }
    }, (reason) => {
    });
  }

  createFormGroup() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      mobile: ['', Validators.required],
    });
  }

  deleteUser(row) {
    this.loaderService.show();
    let data = {
      userId: row._id,
      isGlobal: false,
      isStudent: false,
      repositoryId: this.isOwner?this.schoolId:row.school_id._id
    }
    this.createService.deleteUser(data).subscribe((res) => {
      this.getallprinciples();// call get principal api based on global or school level
      this.loaderService.hide();
    }, err => {
      this.loaderService.hide();
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
  }


  // openPrinciple(principles) {
  //console.log(paper._id)
  //this.router.navigate(['/show/qpaper', {id:paper._id}])
  // window.open(`/view/questionpaper/${id}`)
  // show/qpaper/:id
  //   this.router.navigate(['create/principle/', this.principles], { state: { type: 'update' } })

  // }
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
      this.isOwner = true;
      this.actionFlag = true;
      this.canEdit = true;
    } else if (user.user_info[0].profile_type.role_name == 'teacher') {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = false;
    } else if (user.user_info[0].profile_type.role_name == 'principal') {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = false;
    }
    else if (user.user_info[0].profile_type.role_name == 'management') {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = true;
    }
    else {
      this.isOwner = true;
      this.actionFlag = false;
    }
    this.cdr.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
