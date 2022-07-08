import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LearningService } from '../../learning/services/learning.service';
import * as Papa from 'papaparse';
import { Router } from '@angular/router';
import date from 'src/assets/plugins/formvalidation/src/js/validators/date';
import { EditAllTeacherComponent } from '../all-teacher/edit-all-teacher/edit-all-teacher.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defaultRoles } from '../../roles-permission/default-roles';
import id from 'src/assets/plugins/formvalidation/src/js/validators/id';
import { UpdateTeacherModalComponent } from '../../roles-permission/modals/update-teacher-modal/update-teacher-modal.component';
import Swal from 'sweetalert2';
import { TeacherComponent } from '../teacher/teacher.component';
import { LoadingService } from '../../../loader/loading/loading.service';
import { CreateservicesService } from '../services/createservices.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'kt-all-teacher',
  templateUrl: './all-teacher.component.html',
  styleUrls: ['./all-teacher.component.scss']
})
export class AllTeacherComponent implements OnInit {

  constructor(private apiService: LearningService, public router: Router,
    private modalService: NgbModal, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef, private loaderService: LoadingService, private createService: CreateservicesService) {
    this.teacherForm = this.createFormGroup();
    this.downloadForm = this.formBuilder.group({
      school_id: [''],
    })
  }
  teacherForm: FormGroup;
  downloadForm: FormGroup;
  filterValue: any = '';
  title: string = 'Add teacher';
  teachers: any[] = []
  secondaryClasses: any = [];
  displayedColumns: string[] = ['name', 'mobile', 'gender', 'branch_id', 'school', 'schoolCode', 'action', 'status'];
  dataSource = new MatTableDataSource<any>();
  isOwner: boolean;
  canEdit: boolean;
  schools: any[] = []
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageIndex: any = 1;
  pageSize: any = 5;
  schoolId: any;
  pageEvent: PageEvent;
  resultsLength: any
  actionFlag: boolean = false;
  filterData = {
    searchValue: this.filterValue,
    filterKeysArray: ['name', 'username'],
    flag: "teacher"
  }
  selectedGender:any;


  ngOnInit(): void {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].school_id) {
      id = localStorage.getItem('schoolId');
      this.schoolId = localStorage.getItem('schoolId');
      this.isOwner = true;
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
    }
    if (this.isOwner) {
      this.filterData['school_id'] = this.schoolId
    }

    this.getAdmin();
    this.getallteachers();
    this.getallinstitutes();

  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onPageFired(event) {
    this.loaderService.show();
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize
    let obj = {
      flag: "teacher"
    }
    if (!this.isOwner) {
      this.apiService.getGlobalAllTeacherByPagination(this.filterData, (event.pageIndex + 1), event.pageSize).subscribe((response: any) => {
        // then you can assign data to your dataSource like so
        if (response && response.body && response.body.data && response.body.data.length) {
          this.dataSource = response.body.data;
          this.loaderService.hide();
        }
        this.loaderService.hide();
      }, error => {
        this.loaderService.hide();
      })
    } else {
      this.apiService.getAllTecherByPagination(this.filterData, this.schoolId, (event.pageIndex + 1), event.pageSize).subscribe((response: any) => {
        // then you can assign data to your dataSource like so
        if (response && response.body && response.body.data && response.body.data.length) {
          this.dataSource = response.body.data;
          this.loaderService.hide();
        }
        this.loaderService.hide();
      }, error => {
        this.loaderService.hide();
      })
    }
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
      this.getallteachers(); // call get teacher api based on global or school level
      this.loaderService.hide();
    }, err => {
      this.loaderService.hide();
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
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
              let obj = {
                flag: "teacher"
              }
              this.apiService.getAllTecherByPagination(obj, this.schoolId, this.pageIndex, this.pageSize).subscribe((response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data && response.body.data.length) {
                  this.dataSource = response.body.data;
                  this.loaderService.hide();
                }
                this.loaderService.hide()
              })
            }
          )
        } else {
          this.loaderService.show();
          let obj = {
            activeStatus: true
          }
          this.createService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              let obj = {
                flag: "teacher"
              }
              this.apiService.getAllTecherByPagination(obj, this.schoolId, this.pageIndex, this.pageSize).subscribe((response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data && response.body.data.length) {
                  this.dataSource = response.body.data;
                  this.loaderService.hide();
                }
                this.loaderService.hide()
              })
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
          this.createService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              let obj = {
                flag: "teacher"
              }
              this.apiService.getAllTecherByPagination(obj, this.schoolId, this.pageIndex, this.pageSize).subscribe((response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data && response.body.data.length) {
                  this.dataSource = response.body.data;
                }
                this.loaderService.hide()
              })
            }
          )
        } else {
          this.loaderService.show();
          let obj = {
            activeStatus: false
          }
          this.createService.changeActiveDeactiveStatusAllUser(element._id, obj).subscribe(
            (response: any) => {
              let obj = {
                flag: "teacher"
              }
              this.apiService.getAllTecherByPagination(obj, this.schoolId, this.pageIndex, this.pageSize).subscribe((response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data && response.body.data.length) {
                  this.dataSource = response.body.data;
                }
                this.loaderService.hide()
              })
            }
          )
        }
      })
    }
  }

  getallteachers() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let reqData;
    if (user.user_info[0].school_id) {
      id = localStorage.getItem('schoolId');
      this.schoolId = localStorage.getItem('schoolId');

    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        id = user.user_info[0].repository[0].id
        this.schoolId = user.user_info[0].repository[0].id
      } else {
        id = user.user_info[0]._id;
        this.schoolId = user.user_info[0]._id
      }



    }
    if (!this.isOwner) {
      this.createService.getGlobalTeacherCount(this.filterData).subscribe(
        (response: any) => {
          if (response && response.body) {
            this.resultsLength = response.body.result;
            this.apiService.getGlobalAllTeacherByPagination(this.filterData, this.pageIndex, this.pageSize).subscribe((response: any) => {
              // then you can assign data to your dataSource like so
              if (response && response.body && response.body.data && response.body.data.length) {
                this.dataSource = response.body.data;
                this.loaderService.hide();
              }
              this.loaderService.hide()
            },
              error => {
                this.loaderService.hide();
              })
          }
        }
      )

    } else {
      this.createService.getTeacherCount(this.filterData, this.schoolId).subscribe((response: any) => {
        if (response && response.body) {
          this.resultsLength = response.body.result;
          this.apiService.getAllTecherByPagination(this.filterData, this.schoolId, this.pageIndex, this.pageSize).subscribe((response: any) => {
            // then you can assign data to your dataSource like so
            if (response && response.body && response.body.data && response.body.data.length) {
              this.dataSource = response.body.data;
              this.loaderService.hide();
            }
            this.loaderService.hide()
          },
            error => {
              this.loaderService.hide();
            })
        }
      })
    }
  }


  onChange(files: File[]) {

    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {
          for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].secondary_class == "") {
              this.secondaryClasses = []
            }
            else {
              this.secondaryClasses = result.data[i].secondary_class
            }
            const teacherData = {
              'passport_image': '',
              'profile_type': result.data[i].profile_type,
              'school_id': result.data[i].school_id,
              'branch_id': result.data[i].branch_id,
              'primary_class': result.data[i].primary_class,
              'primary_section': result.data[i].primary_section,
              // 'subject': [],
              'secondary_class': this.secondaryClasses,
              'name': result.data[i].name,
              'mobile': result.data[i].mobile,
              'gender': result.data[i].gender,
              'password': result.data[i].password,
              'qualification': result.data[i].qualification,
              'dob': result.data[i].dob,
              'email': result.data[i].email,
              'repository': [{
                'id': result.data[i].school_id,
                'repository_type': 'School',
              }],
              'username': result.data[i].username,
              'address': result.data[i].address,
              'aadhar_card': result.data[i].aadhar_card,
              'blood_gr': result.data[i].blood_gr,
              'religion': result.data[i].religion,
              'caste': result.data[i].caste,
              'mother_tounge': result.data[i].mother_tounge,
              'marital_status': result.data[i].marital_status,
              'experience': result.data[i].experience,
              'level': result.data[i].level,
              'city': result.data[i].city,
              'state': result.data[i].state,
              'country': result.data[i].country,
              'pincode': result.data[i].pincode,
              'leaderShip_Exp': result.data[i].leaderShip_Exp,
              'cv': result.data[i].cv,
              'ten_details': {
                'school': '',
                'Board': '',
                'percentage': '',
                'year_of_passing': '',
                'Attach_doc': ''
              },
              'twelve_details': {
                'school': '',
                'Board': '',
                'percentage': '',
                'year_of_passing': '',
                'Attach_doc': ''
              },
              'graduation_details': {
                'school': '',
                'Board': '',
                'percentage': '',
                'year_of_passing': '',
                'Attach_doc': ''
              },
              'masters_details': {
                'school': '',
                'Board': '',
                'percentage': '',
                'year_of_passing': '',
                'Attach_doc': ''
              },
              'other_degrees': {
                'other1': ''
              },
              'certifications': {
                'ca1': ''
              },
              'extra_achievement': {
                'extra_achievement': ''
              }
            }

            this.apiService.signUp(teacherData).subscribe((response: any) => {
              if (response.status == 201) {
                Swal.fire('Account Created', 'Profile  created successfully', 'success');
              } else {
                Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
                return;
              }
            }, (error) => {
              if (error.status == 400) {
                Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              } else {
                Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              }
            })
          }
        }
      });
    }
  }


  //Update
  updateTeacher(teachers) {
    const modalRef = this.modalService.open(TeacherComponent, { size: 'xl' ,backdrop:'static'});
    modalRef.componentInstance.teacherUpdate = teachers;
    modalRef.componentInstance.updateFlag = true;
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.getallteachers(); // Refresh Data in table grid
      }
    }, (reason) => {
    });
  }

  createFormGroup() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      level: [''],
      aadhar_card: ['',],
      mobile: ['', Validators.required],
      gender: ['', Validators.required],
      marital_status: ['',],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"), Validators.required]],
    });
  }

  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    // let

    // defaultRoles.find(role => { return role.role_name == 'admin' })
    if (user.user_info[0].profile_type.role_name == 'admin') {

      this.isOwner = false;
      this.actionFlag = false;
      this.canEdit = false;
    }
    else if (user.user_info[0].profile_type.role_name == 'school_admin') {
      this.actionFlag = true;
      this.isOwner = true;
      this.canEdit = true;
    }
    else if (user.user_info[0].profile_type.role_name == 'teacher') {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = false;
    }
    else if (user.user_info[0].profile_type.role_name == 'principal') {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = true;
    }
    else if (user.user_info[0].profile_type.role_name == 'management') {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = true;
    } else if (localStorage.getItem('schoolId')) {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = false;
    }
    else {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = false;
    }
    this.cdr.detectChanges();
  }


  applyFilter(event?: Event) {
    let filterValuee = "";
    if(event){
      filterValuee = (event.target as HTMLInputElement).value;
    }
    
    if (this.isOwner) {
      this.filterData['school_id'] = this.schoolId
    }
    this.filterData['searchValue'] = filterValuee

    if (!this.isOwner) {
      this.createService.getGlobalTeacherCount(this.filterData).subscribe(
        (response: any) => {
          if (response && response.body) {
            this.resultsLength = response.body.result;
            this.apiService.getGlobalAllTeacherByPagination(this.filterData, 1, 5).subscribe((response: any) => {
              // then you can assign data to your dataSource like so
              if (response && response.body && response.body.data) {
                this.dataSource = response.body.data;
                this.cdr.detectChanges();
                this.loaderService.hide();
              }
              this.loaderService.hide()
            },
              error => {
                this.loaderService.hide();
              })
          }
        }
      )

    } else {
      this.createService.getTeacherCount(this.filterData, this.schoolId).subscribe((response: any) => {
        if (response && response.body) {
          this.resultsLength = response.body.result;
          this.apiService.getAllTecherByPagination(this.filterData, this.schoolId, 1, 5).subscribe((response: any) => {
            // then you can assign data to your dataSource like so
            if (response && response.body && response.body.data) {
              this.dataSource = response.body.data;
              this.cdr.detectChanges();
              this.loaderService.hide();
            }
            this.loaderService.hide()
          },
            error => {
              this.loaderService.hide();
            })
        }
      })
    }

    this.dataSource.filter = filterValuee.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getallinstitutes() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.schools = data.body.data;


      // this.downloadForm.get('school_id').valueChanges.subscribe(val => {

      //   this.dtSchools = data.body.data.filter(usr => {
      //     return usr._id == this.downloadForm.controls.school_id.value

      //   })
      // })
      this.cdr.detectChanges();

    })
  }

  genderSelected(){
    this.applyFilter();
    this.filterData['gender'] ? delete this.filterData['gender'] : '';
    if(this.selectedGender){
      this.filterData['gender'] = this.selectedGender;
      this.applyFilter();
    }
  }
}
