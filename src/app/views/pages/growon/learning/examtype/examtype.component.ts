import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LearningService } from '../services/learning.service';
import { CreateservicesService } from '../../create/services/createservices.service';
import Swal from 'sweetalert2';
import { ImportFromGlobalComponent } from '../import-from-global/import-from-global.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingService } from '../../../loader/loading/loading.service';
@Component({
  selector: 'kt-examtype',
  templateUrl: './examtype.component.html',
  styleUrls: ['./examtype.component.scss']
})
export class ExamtypeComponent implements OnInit {

  constructor(private apiService: LearningService, private cdr: ChangeDetectorRef, private createApiServices: CreateservicesService,
    private modalService: NgbModal, private loadingService: LoadingService) { }
  name: any;
  isOwner: boolean;
  description: any;
  examTypes: any;
  classesLoaded: boolean = false;
  index: number = 0;
  classCount: number = 100;
  btnTitle = 'Add Exam type';
  editingExamTypes: boolean = false;
  currentExamTypeId: any;

  displayedColumns: string[] = ['name', 'description', 'createdBy', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  classes: any;
  classmap: any;
  class: any;
  ngOnInit(): void {
    this.loadingService.show();
    this.getExamType();
    this.getClasses();
    this.getAdmin();
    this.getallinstitutes();
    this.loadingService.hide();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // Add exam type
  addExamType(data) {
    this.loadingService.show();
    if (data.name) {
      let userInfo = localStorage.getItem('info');
      let user = JSON.parse(userInfo);
      let id: any;
      let repo: any;
      if (user.user_info[0].school_id) {
        id = user.user_info[0].school_id;
        repo = 'School';
      }
      //  else {
      //   id = user.user_info[0].id;

      //   repo = 'Global';
      // }
      // else if (user.user_info[0]._id) {
      //   id = user.user_info[0]._id;

      //   repo = 'Global';
      // }
      else {

        if (user.user_info[0].repository && user.user_info[0].repository.length) {
          id = user.user_info[0].repository[0].id
          repo = user.user_info[0].repository[0].repository_type;
        } else {
          id = user.user_info[0]._id
          repo = 'Global'
        }


        // id = user.user_info[0].repository[0].id;
        // repo = user.user_info[0].repository[0].repository_type;
      }
      /* if(user.user_info[0].profile_type == 'school_admin'){
        id = user.user_info[0].school_id;
        repo = 'School';
      }else if(user.user_info[0].profile_type == 'admin'){
        id = user.user_info[0].id;
        repo = 'Global';
      }else{
        id = null;
        repo = null;
      } */
      const examType = {
        'name': data.name,
        'description': this.description,
        'repository': [{ 'id': id, 'branch_name': '', 'repository_type': repo, 'mapDetails': [] }],
        'createdBy': localStorage.getItem('UserName')
      }

      if (this.editingExamTypes) {
        if (this.currentExamTypeId) {
          this.apiService.updateExamTypes(this.currentExamTypeId, examType, id, data.name).subscribe((response: any) => {
            Swal.fire('Success', ' Updated', 'success').then(() => {
              this.class = '';
              this.name = '';
              this.description = '';
              this.getExamType();
              this.cdr.detectChanges();
              this.loadingService.hide();
            });
            let element = document.getElementById('reset') as HTMLElement;
            element.click();
          }, (error) => {
            if (error.status == 400) {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
              this.loadingService.hide();
              return;
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
              this.loadingService.hide();
              return;
            }
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'reload the page and try again' });
          this.loadingService.hide();
          return;
        }
      }
      else {

        this.apiService.addExamType(examType, id, data.name).subscribe((response: any) => {
          if (response.status == 201) {
            Swal.fire('Success', 'Exam Type Added', 'success').then(() => {
              this.class = '';
              this.name = '';
              this.description = '';
              this.getExamType();
              this.cdr.detectChanges();
              this.loadingService.hide();
            });
            let element = document.getElementById('reset') as HTMLElement;
            element.click();
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
            this.loadingService.hide();
            return;
          }
        }, (error) => {
          if (error.status == 400) {
            console.log('error => ', error)
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            this.loadingService.hide();
            return;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            this.loadingService.hide();
            return;
          }
        })
        this.ngOnInit();
        this.loadingService.hide();
      }
    } else {
      this.loadingService.hide();
      Swal.fire({ icon: 'error', title: 'Error', text: 'Name  is required' });
      return;
    }
    this.ngOnInit();
    this.loadingService.hide();
  }
  //  get exam type
  getExamType() {
    this.loadingService.show();
    this.apiService.getExamType().subscribe((response: any) => {
      this.examTypes = response.body.data;
      this.classesLoaded = true;
      this.cdr.detectChanges();
      this.dataSource.data = this.examTypes;
    })
    this.loadingService.hide();
  }

  //delete exam type
  deleteUser(row) {
    this.loadingService.show();
    let data = {
      examTypeId: row._id,
      isGlobal: this.isOwner,
      repositoryId: row.repository[0].id,
    }
    this.apiService.deleteExamType(data).subscribe((res) => {
      this.getExamType(); // call get student api based on global or school level
      this.loadingService.hide();
    }, err => {
      this.loadingService.hide();
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
  }

  // Pagination
  next() {
    this.classesLoaded = false;
    this.index = this.index + 10;
    this.classCount = this.classCount + 10;
    this.getExamType();
  }
  prev() {
    this.classesLoaded = false;
    this.index = this.index - 10;
    this.classCount = this.classCount - 10;
    this.getExamType();
  }

  // updateClass
  updateExamType(id, name, description, eTypeClass) {
    this.class = eTypeClass;
    this.name = name;
    this.description = description;
    this.currentExamTypeId = id;
    this.btnTitle = 'Update exam type';
    this.editingExamTypes = true;
  }
  // cancelEdit
  cancelEdit() {
    this.class = '';
    this.name = '';
    this.description = '';
    this.currentExamTypeId = '';
    this.btnTitle = 'Add exam type';
    this.editingExamTypes = false;
  }
  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
      this.cdr.detectChanges();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  import() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "examType";
  }
  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;


    // defaultRoles.find(role => { return role.role_name == 'admin' })
    if (user.user_info[0].profile_type.role_name == 'school_admin' ||
      user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'management'
      || user.user_info[0].profile_type.role_name == 'principal') {


      this.isOwner = true
      console.log(this.isOwner)
    } else if (localStorage.getItem('schoolId')) {
      this.isOwner = true;
    }
    else {
      this.isOwner = false
    }
  }
  getallinstitutes() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.createApiServices.getallinstitute(id).subscribe((data: any) => {
      this.classmap = data.body.data[0].classList;

      this.cdr.detectChanges();

    })

  }
}
