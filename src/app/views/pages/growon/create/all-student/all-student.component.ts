import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateservicesService } from '../services/createservices.service';
import { Router } from '@angular/router';
import * as Papa from 'papaparse';
import { EditAllStudentComponent } from '../all-student/edit-all-student/edit-all-student.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LearningService } from '../../learning/services/learning.service';
import { defaultRoles } from '../../roles-permission/default-roles';
// import { BulkUploadStudentComponent } from './bulk-upload-student/bulk-upload-student.component';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
import Swal from 'sweetalert2';
import { StudentDetails } from '../../model/studentdetails.model';
import { LoadingService } from '../../../loader/loading/loading.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { roundWithPrecision } from 'chartist';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { result } from 'lodash';

@Component({
  selector: 'kt-all-student',
  templateUrl: './all-student.component.html',
  styleUrls: ['./all-student.component.scss']
})
export class AllStudentComponent implements OnInit {
  activeStatus: boolean = false;
  bulkUploadErrorFlag:boolean=false;
  @Output()
  change: EventEmitter<MatSlideToggleChange>
  resultsLength: any = 0;

  actionFlag: boolean = false;
  constructor(public apiService: CreateservicesService, public router: Router, private modalService: NgbModal, private cdr: ChangeDetectorRef, private formBuilder: FormBuilder,
    public learningapiService: LearningService, private loaderService: LoadingService) {

    this.downloadForm = this.formBuilder.group({
      school_id: ['', Validators.required],
      class_id: ['',]
    })
  }
  filterValue: any = "";
  title: string = 'Add Student';
  progress: number = 0;
  downloadForm: FormGroup;
  studentForm: FormGroup;
  isOwner: boolean;
  canEdit: boolean;
  csvContent: string;
  displayedColumns: string[] = ['name', 'username', 'gender', 'class','section', 'branch_id', 'school', 'schoolCode', 'action', 'status'];
  dataSource = new MatTableDataSource<any>();
  students: any[] = []
  // selectedSchool: any;
  formula: string = "Formula 1";
  fileDownloaded: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // dtSchools: any;
  csvSectionid: any[] = []
  csvSectionname: any[] = []
  csvSectionclassid: any[] = []
  csvSectionschoolid: any[] = []
  csvSchools: any[] = []
  csvClass: any[] = []
  csvSection: any[] = []
  csvid: any[] = []
  csvClassid: any[] = []
  csvClassName: any[] = []
  csvSchoolName: any[] = []
  csvBrancName: any[] = []
  schools: any[] = []
  classes: any[] = []
  sections: any[] = []
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'School  List :',
    useBom: true,
    noDownload: false,
    headers: ["_id", "schoolName", "branchName"]
  };
  csvOptions2 = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'class  List :',
    useBom: true,
    noDownload: false,
    headers: ["class_id", "className"]
  };
  csvOptions3 = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Section  List :',
    useBom: true,
    noDownload: false,
    headers: ["Class_id", "sectionName", "section_id", "school_id"]
  };
  pageIndex: any = 1;
  pageSize: any = 5;
  schoolId: any;
  pageEvent: PageEvent;
  filterdata = {
    searchValue: this.filterValue,
    filterKeysArray: ['name', 'username'],
   
  }
  classList:any;
  selectedClass:any;
  sectionList:any;
  selectedSection:any;
  selectedGender:any;

  ngOnInit(): void {
    this.getallstudents();
    this.getAdmin();
    this.getallinstitutes();
    this.getAllClasses();
    this.getSection();
    this.getClasses();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.dataSource)
  }


  async getallstudents() {
    this.loaderService.show();
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      this.schoolId = localStorage.getItem('schoolId');
      this.isOwner = true;
    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.schoolId = user.user_info[0].repository[0].id
      } else {
        this.schoolId = user.user_info[0]._id;
      }
      this.isOwner = false;
      // this.schoolId = user.user_info[0]._id;
    }
    if (this.isOwner) {
      this.filterdata['school_id'] = this.schoolId
    }
    this.doAsyncTask().then(
    )
    // this.getAllStudentData();
    this.loaderService.hide();

  }

  getAllStudentData() {
    this.loaderService.show();
    if (!this.isOwner) {
      this.apiService.getGlobalStudentPagination(this.pageIndex, this.pageSize).subscribe(
        (data: any) => {
          console.log(data.body.data)
          this.students = data.body.data;
          this.dataSource = data.body.data;
          console.log(this.dataSource)
          this.loaderService.hide();
        }, error => {
          this.loaderService.hide()
        }
      )
      this.loaderService.hide()
    } else {
     
      this.apiService.getallstudent(this.schoolId, this.pageIndex, this.pageSize).subscribe((data: any) => {
        console.log(data.body.data)
        this.students = data.body.data;
        this.dataSource = data.body.data;
        console.log(this.dataSource)
        this.loaderService.hide();
      }, error => {
        
        this.loaderService.hide()
      })
    }
    this.loaderService.hide();
  }
  doAsyncTask() {
    var promise = new Promise((resolve, reject) => {
      if (!this.isOwner) {
        this.apiService.getGlobalStudentCountPostFilter(this.filterdata).subscribe(
          (response: any) => {
            if (response && response.body) {
              this.resultsLength = response.body.result;
              this.apiService.getGlobalStudentPaginationPostFilter(1, 5, this.filterdata).subscribe(
                (response: any) => {
                  // then you can assign data to your dataSource like so
                  if (response && response.body && response.body.data && response.body.data.length) {
                    this.dataSource = response.body.data;
                    console.log(this.dataSource)
                    this.loaderService.hide();
                  }
                  this.loaderService.hide()
                }, error => {
                  this.loaderService.hide()
                }
              )
              this.cdr.detectChanges();
            }
          }, error => {
            this.loaderService.hide()
          }
        )
      } else {
        this.apiService.getStudentRecordCountPostFilter(this.schoolId, this.filterdata).subscribe(
          (response: any) => {
            if (response && response.body) {
              this.resultsLength = response.body.count;
              this.apiService.getallstudentPostFilter(this.schoolId, 1, 5, this.filterdata).subscribe((response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data && response.body.data.length) {
                  this.dataSource = response.body.data;
                  console.log(this.dataSource)

                  this.loaderService.hide();
                }
                this.loaderService.hide()
              }, error => {
                this.loaderService.hide()
              })
              this.cdr.detectChanges();
            }
          }, error => {
            this.loaderService.hide()
          }
        )
      }
    });
    return promise;
  }

  onPageFired(event) {
    this.loaderService.show();
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    if (!this.isOwner) {
      this.apiService.getGlobalStudentPaginationPostFilter((event.pageIndex + 1), event.pageSize, this.filterdata).subscribe(
        (response: any) => {
          // then you can assign data to your dataSource like so
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = response.body.data;
            console.log(this.dataSource)

            this.loaderService.hide();
          }
          this.loaderService.hide()
        }, error => {
          this.loaderService.hide()
        }
      )
      this.loaderService.hide()
    } else {
      this.apiService.getallstudentPostFilter(this.schoolId, (event.pageIndex + 1), event.pageSize, this.filterdata).subscribe((response: any) => {
        // then you can assign data to your dataSource like so
        if (response && response.body && response.body.data && response.body.data.length) {
          this.dataSource = response.body.data;
          console.log(this.dataSource)

          this.loaderService.hide();
        }
        this.loaderService.hide()
      }, error => {
        this.loaderService.hide()
      })
      this.loaderService.hide()
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
          this.apiService.changeActiveDeactiveStatus(element._id, obj).subscribe(
            (response: any) => {
              this.apiService.getallstudent(this.schoolId, this.pageIndex, this.pageSize).subscribe((response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data && response.body.data.length) {
                  this.dataSource = response.body.data;
                  console.log(this.dataSource)

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
          this.apiService.changeActiveDeactiveStatus(element._id, obj).subscribe(
            (response: any) => {
              this.apiService.getallstudent(this.schoolId, this.pageIndex, this.pageSize).subscribe((response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data && response.body.data.length) {
                  this.dataSource = response.body.data;
                  console.log(this.dataSource)

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
          this.apiService.changeActiveDeactiveStatus(element._id, obj).subscribe(
            (response: any) => {
              this.apiService.getallstudent(this.schoolId, this.pageIndex, this.pageSize).subscribe((response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data && response.body.data.length) {
                  this.dataSource = response.body.data;
                  console.log(this.dataSource)

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
          this.apiService.changeActiveDeactiveStatus(element._id, obj).subscribe(
            (response: any) => {
              this.apiService.getallstudent(this.schoolId, this.pageIndex, this.pageSize).subscribe((response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data && response.body.data.length) {
                  this.dataSource = response.body.data;
                  console.log(this.dataSource)

                }
                this.loaderService.hide()
              })
            }
          )
        }
      })
      this.loaderService.hide()
    }
  }

  onChange(files: File[]) {

    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {

        }
      });
    }
  }


  //Update
  updateStudent(students: StudentDetails) {
    const modalRef = this.modalService.open(EditAllStudentComponent, { size: 'xl' , backdrop : 'static'});
    modalRef.componentInstance.students = students;
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.getallstudents(); // Refresh Data in table grid
      }    
    }, (reason) => {
    });
  }

  deleteUser(row) {
    this.loaderService.show();
    let data = {
      userId: row._id,
      isGlobal: false ,
      isStudent: true,
      repositoryId: this.isOwner?this.schoolId:row.school_id
    }
    this.apiService.deleteUser(data).subscribe((res) => {
      this.getallstudents(); // call get student api based on global or school level
      this.loaderService.hide();
    }, err => {
      this.loaderService.hide();
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
  }

  bulkUploadStudent(files: File[]) {
    this.bulkUploadErrorFlag  =false;
   let counter=0;
   let resultLengthData
    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {


          resultLengthData=result.data.length;
          for (let i = 0; i < result.data.length; i++) {

            const studentData = {
              'gender': result.data[i].gender,
              'profile_image': result.data[i].profile_image,
              // 'school_id': localStorage.getItem('schoolId'),
              // Make the value dynamic

              'school_id': result.data[i].school_id._id,
              'branch_id': result.data[i].branch_id.name, // Make the value dynamic
              'name': result.data[i].name,
              'username': result.data[i].username,
              'password': '',
              'p_username': result.data[i].p_username,
              'P_profile_type': result.data[i].P_profile_type,
              'p_password': result.data[i].p_password,
              'guardian': result.data[i].guardian,

              'repository': [{
                'id': result.data[i].school_id,
                'repository_type': 'School',
              }],
              'contact_number': '',
              'dob': result.data[i].dob,
              'email': result.data[i].email,
              'subjects': [],
              'address': result.data[i].address,
              'aadhar': result.data[i].aadhar,
              'sts_no': result.data[i].sts_no,
              'rte_student': result.data[i].rte_student,
              'caste': result.data[i].caste,
              'city': result.data[i].city._id._id,
              'state': result.data[i].state_id._id,
              'country': result.data[i].country_id._id,
              'pincode': result.data[i].pincode,
              'religion': result.data[i].religion,
              'mother_tongue': result.data[i].mother_tongue,
              'blood_gr': result.data[i].blood_gr,
              'mode_of_transp': result.data[i].mode_of_transp,
              'medical_cond': result.data[i].medical_cond,
              'wear_glasses': result.data[i].wear_glasses,
              'class': result.data[i].class._id,
              'profile_type': result.data[i].profile_type,
              'section': result.data[i].section._id,

              'father_name': result.data[i].father_name,
              'f_contact_number': result.data[i].f_contact_number,
              'mobile_to_reg_student': result.data[i].mobile_to_reg_student,
              'f_email': result.data[i].f_email,
              'f_qualification': result.data[i].f_qualification,
              'f_aadhar_no': result.data[i].f_aadhar_no,
              'language_proficiency': [{
                'languageOne': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
                'languageTwo': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
                'languageThree': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
                'languageFour': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
              }],
              'mother_name': result.data[i].mother_name,
              'm_contact_number': result.data[i].m_contact_number,
              'm_mobile_to_reg_student': result.data[i].m_mobile_to_reg_student,
              'm_email': result.data[i].m_email,
              'm_qualification': result.data[i].m_qualification,
              'm_aadhar_no': result.data[i].m_aadhar_no,
              'm_language_proficiency': [{
                'languageOne': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
                'languageTwo': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
                'languageThree': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
                'languageFour': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
              }],
              'guardian_name': result.data[i].guardian_name,
              'guardian_mobile': result.data[i].guardian_mobile,
              'guardian_mobile_to_reg_student': result.data[i].guardian_mobile_to_reg_student,
              'g_email': result.data[i].g_email,
              'g_qualificaton': result.data[i].g_qualificaton,
              'g_aadhar': result.data[i].g_aadhar,

              'g_language_proficiency': [{
                'languageOne': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
                'languageTwo': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
                'languageThree': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
                'languageFour': {
                  'languageName': '',
                  'read': '',
                  'write': '',
                  'speak': '',
                },
              }]
            }
            this.apiService.registerStudent(studentData).subscribe((response: any) => {
              counter++;
              if((counter==resultLengthData) && this.bulkUploadErrorFlag){
                Swal.fire({ icon: 'error', title: 'Error', text: "There was error while uploading" });
              }
              if (response.status == 201) {
                Swal.fire('Account Created', 'Student Created Successfully', 'success');
              } else {
                Swal.fire({ icon: 'error', title: 'Error please try again', text: response.body.data });
                return;
              }

            },
              (error) => {
                this.bulkUploadErrorFlag=true;
                counter++;
                if((counter==resultLengthData) && this.bulkUploadErrorFlag){
                  Swal.fire({ icon: 'error', title: 'Error', text: "There was error while uploading" });
                }
                if (error.status == 400) {
                  Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
                  return;
                } else {
                  Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
                  return;
                }

              })
          }
        }
      });
    }


  }

  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].profile_type.role_name == 'admin') {

      this.isOwner = false;
      this.actionFlag = false;
      this.canEdit = false
    }
    else if (user.user_info[0].profile_type.role_name == 'school_admin') {
      this.actionFlag = true;
      this.isOwner = true;
      this.canEdit = true
    } else if (user.user_info[0].profile_type.role_name == 'teacher') {
      this.actionFlag = false
      this.isOwner = true;
      this.canEdit = true
    } else if (user.user_info[0].profile_type.role_name == 'principal') {
      this.actionFlag = false
      this.isOwner = true;
      this.canEdit = true
    } else if (user.user_info[0].profile_type.role_name == 'management') {
      this.actionFlag = false
      this.isOwner = true;
      this.canEdit = true
    } else if (localStorage.getItem('schoolId')) {
      this.actionFlag = false
      this.isOwner = true;
      this.canEdit = false;
    }
    else {
      this.actionFlag = false;
      this.isOwner = true;
      this.canEdit = false
    }
    this.cdr.detectChanges();
  }
  applyFilter(event?: Event) {
    let filterValuee="";
    if(event){
      filterValuee = (event.target as HTMLInputElement).value;
    }

    // filterKeysArray:['name', 'username', 'gender' , 'className', 'branch_id', 'schoolName'],
    if (this.isOwner) {
      this.filterdata['school_id'] = this.schoolId
    }
    this.filterdata['searchValue'] = filterValuee
    // this.apiService.searchStudentData(filterdata).subscribe(
    //   (response:any)=>{
    //     if(response && response.body && response.body.data && response.body.data.length)
    //     {
    //       console.log(response.body.data)
    //     }
    //   }
    // )
    if (!this.isOwner) {
      this.apiService.getGlobalStudentCountPostFilter(this.filterdata).subscribe(
        (response: any) => {
          if (response && response.body) {
            this.resultsLength = response.body.result;
            this.apiService.getGlobalStudentPaginationPostFilter(1, 5, this.filterdata).subscribe(
              (response: any) => {
                // then you can assign data to your dataSource like so
                if (response && response.body && response.body.data) {
                  this.dataSource = response.body.data;
                  console.log(this.dataSource)

                  this.loaderService.hide();
                }
                this.loaderService.hide()
              }, error => {
                this.loaderService.hide()
              }
            )
            this.cdr.detectChanges();
          }
        }, error => {
          this.loaderService.hide()
        }
      )
    } else {
      this.apiService.getStudentRecordCountPostFilter(this.schoolId, this.filterdata).subscribe(
        (response: any) => {
          if (response && response.body) {
            this.resultsLength = response.body.count;
            this.apiService.getallstudentPostFilter(this.schoolId, 1, 5, this.filterdata).subscribe((response: any) => {
              // then you can assign data to your dataSource like so
              if (response && response.body && response.body.data) {
                this.dataSource = response.body.data;
                console.log(this.dataSource)

                this.loaderService.hide();
              }
              this.loaderService.hide()
            }, error => {
              this.loaderService.hide()
            })
            this.cdr.detectChanges();
          }
        }, error => {
          this.loaderService.hide()
        }
      )
    }

    this.dataSource.filter = filterValuee.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  downloadCSV() {

    new AngularCsv(this.csvSchools, "SchoolList", this.csvOptions);
  }
  downloadCSV2() {

    new AngularCsv(this.csvClass, "classList", this.csvOptions2);
  }
  downloadCSV3() {

    new AngularCsv(this.csvSection, "SectionList", this.csvOptions3);
  }

  getallinstitutes() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getallinstitutenew(id, true).subscribe((data: any) => {
      this.schools = data.body.data;
      for (let i = 0; i < this.schools.length; i++) {
        this.csvid[i] = this.schools[i]._id
        this.csvSchoolName[i] = this.schools[i].schoolName
        this.csvBrancName[i] = this.schools[i].branch[0] ? this.schools[i].branch[0].Name : '';
        this.csvSchools[i] = [this.csvid[i], this.csvSchoolName[i], this.csvBrancName[i]]
      }
      // this.cdr.detectChanges();

    })
  }
  getSection() {
    this.apiService.getGlobalSections().subscribe((response: any) => {
      this.sections = response.body.data;
      console.log(this.sections, "section")
      for (let i = 0; i < this.sections.length; i++) {
        this.csvSectionid[i] = this.sections[i]._id
        this.csvSectionname[i] = this.sections[i].name
        this.csvSectionclassid[i] = this.sections[i].class_id
        this.csvSectionschoolid[i] = this.sections[i].repository[0].id
        this.csvSection[i] = [this.csvSectionclassid[i], this.csvSectionname[i], this.csvSectionid[i], this.csvSectionschoolid[i]]
      }
      console.log(this.csvSection, "csvSection")
    })
  }
  getAllClasses() {
    this.learningapiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;

      for (let i = 0; i < this.classes.length; i++) {
        this.csvClassid[i] = this.classes[i]._id
        this.csvClassName[i] = this.classes[i].name
        this.csvClass[i] = [this.csvClassid[i], this.csvClassName[i]]
      }
    })
  }


  handleFileSelect(event) {


    const file = event.target.files[0];
    var reader = new FileReader();
    this.cdr.detectChanges();
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    this.apiService.bulkUploadstudent(formData).subscribe((response: any) => {
      if (response.status === 201) {
        Swal.fire('Success', 'success', 'success');
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your file please try again' });
        return;
      }
    });

    reader.readAsText(file);
    reader.onload = (event: any) => {
      const csv = event.target.result;



    }
  }




  onFileLoad(fileLoadedEvent) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
  }

  onFileSelect(input: HTMLInputElement) {

    const files = input.files;
    var content = this.csvContent;

    if (files && files.length) {
      /*
       console.log("Filename: " + files[0].name);
       console.log("Type: " + files[0].type);
       console.log("Size: " + files[0].size + " bytes");
       */

      const fileToRead = files[0];

      const fileReader = new FileReader();
      fileReader.onload = this.onFileLoad;

      fileReader.readAsText(fileToRead, "UTF-8");
    }

  }

  //To Get Classes
  getClasses(){
   
    if(!localStorage.getItem('schoolId')){
      this.learningapiService.getAllClasses().subscribe((res:any)=>{
        console.log('ClassList',res.body.data)
        this.classList = res.body.data;
      })
     
    }else{
      this.apiService.getSchool(localStorage.getItem('schoolId')).subscribe((res:any)=>{
        console.log(res.body.data);
        this.classList = res.body.data[0].classList;
      });
    }
  }
  // Once Class Selected
  classSelected(){
    this.applyFilter();
    this.filterdata['class'] ? delete this.filterdata['class'] : ''
    if(this.selectedClass){
      this.filterdata['class'] = this.selectedClass;
      this.applyFilter();
         // To Load sections
   
    this.apiService.getSectionbyClass(this.selectedClass).subscribe((res:any)=>{
      console.log(res)
      this.sectionList = res.body.data;
    })
    }
 
    //alert(this.selectedClass)
  }

  sectionSelected(){
    this.applyFilter();
    this.filterdata['section'] ? delete this.filterdata['section'] : '';
    if(this.selectedSection){
      this.filterdata['section'] = this.selectedSection;
      this.applyFilter();
    }
  }

  genderSelected(){
    this.applyFilter();
    this.filterdata['gender'] ? delete this.filterdata['gender'] : '';
    if(this.selectedGender){
      this.filterdata['gender'] = this.selectedGender;
      this.applyFilter();
    }
  }



}
