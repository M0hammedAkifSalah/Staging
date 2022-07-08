import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LearningService } from '../services/learning.service';
import { CreateservicesService } from '../../create/services/createservices.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportFromGlobalComponent } from '../import-from-global/import-from-global.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'kt-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent implements OnInit {
  schoolId: string;

  constructor(private apiService: LearningService, private createApiServices: CreateservicesService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }
  name: any;
  isOwner: boolean;
  description: any;
  subjects: any;
  schoolSubjects: any;
  classesLoaded: boolean = false;
  index: number = 0;
  classCount: number = 100;
  editingSubject: boolean = false;
  btnTitle = 'Add Subject';
  currentSubjectId: any;
  displayedColumns: string[] = ['name', 'description', 'createdBy', 'action'];
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  @ViewChild('MatPaginator') paginator: MatPaginator;
  @ViewChild('MatPaginator2') paginator2: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  classes: any;
  classmap: any;
  class: any;
  ngOnInit(): void {
    this.getAllSubjects();
    this.getClasses();
    this.getAdmin();
    this.getallinstitutes();
    this.getSchoolSubjects();;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort;
  }
  addSubject(data) {
    if (data.name) {
      let userInfo = localStorage.getItem('info');
      let user = JSON.parse(userInfo);
      let id: any;
      let repo: any;
      if (user.user_info[0].school_id) {
        id = user.user_info[0].school_id;
        repo = 'School';
      }
      // else {
      //   id = user.user_info[0].id;
      //   // id = user.user_info[0].repository[0].id;
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
      const subjectData = {
        'class_id': this.class,
        'name': data.name,
        'S_image': '',
        'description': this.description,
        'repository': [{ 'id': id, 'branch_name': '', 'repository_type': repo, 'mapDetails': [], }],
        'createdBy': localStorage.getItem('UserName'),
        'updatedBy': localStorage.getItem('UserName')
      }

      if (this.editingSubject) {
        if (this.currentSubjectId) {
          this.apiService.updateSubject(this.currentSubjectId, subjectData, id, data.name).subscribe((response: any) => {
            Swal.fire('Success', 'Class Updated', 'success').then(() => location.reload());
            let element = document.getElementById('reset') as HTMLElement;
            element.click();
          }, (error) => {
            if (error.status == 400) {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
              return;
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
              return;
            }
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'reload the page and try again' });
          return;
        }
      }
      else {
        this.apiService.addSubjects(subjectData, id, data.name).subscribe((response: any) => {
          if (response.status == 201) {
            Swal.fire('Success', 'Subject Added', 'success').then(() => {
              this.class = '';
              this.name = '';
              this.description = '';
              this.cdr.detectChanges();
              //    window.location.reload()
            });
            let element = document.getElementById('reset') as HTMLElement;
            element.click();
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
            return;
          }
        }, (error) => {
          if (error.status == 400) {
            console.log('error => ', error)
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            return;
          } else {
            Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
            return;
          }
        })
        this.ngOnInit();
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Name and Class are required' });
      return;

    }
    this.ngOnInit();
  }
  // get all subjects
  getAllSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      let sub = [];
      for (let i = this.index; i < this.classCount; i++) {
        if (response.body.data[i]) {
          sub.push(response.body.data[i]);
        }
      }
      this.subjects = sub;
      this.classesLoaded = true;
      this.cdr.detectChanges();
      this.dataSource.data = this.subjects;
      console.log(' this.subjects', response);
    })
  }
  getSchoolSubjects() {
    this.apiService.getSchoolSubjects().subscribe((response: any) => {
      let sub = [];
      for (let i = this.index; i < this.classCount; i++) {
        if (response.body.data[i]) {
          sub.push(response.body.data[i]);
        }
      }
      this.schoolSubjects = sub;
      this.classesLoaded = true;
      this.cdr.detectChanges();
      this.dataSource2.data = this.schoolSubjects;
      console.log(' this.subjects', response);
    })
  }
  // Pagination
  next() {
    this.classesLoaded = false;
    this.index = this.index + 10;
    this.classCount = this.classCount + 10;
    this.getAllSubjects();
  }
  prev() {
    this.classesLoaded = false;
    this.index = this.index - 10;
    this.classCount = this.classCount - 10;
    this.getAllSubjects();
  }
  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
      this.cdr.detectChanges();
    });
  }
  // updateClass
  updateSubject(id, name, description, subClass) {
    this.name = name;
    this.description = description;
    this.class = subClass;
    this.currentSubjectId = id;
    this.btnTitle = 'Update Subject';
    this.editingSubject = true;
  }

  deleteSubject(row) {
    this.classesLoaded = false;
    if (this.isOwner) { // is school admin
      let data = {
        subjectId: row._id,
        schoolId: this.schoolId
      }
      this.apiService.deleteSchoolAdminSubject(data).subscribe((res) => {
        this.getSchoolSubjects();
      }, err => {
        this.classesLoaded = true;
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      })
    } else {
      let data = {
        subjectId: row._id,
      }
      this.apiService.deleteGlobalSubject(data).subscribe((res) => {
        this.getAllSubjects();
      }, err => {
        this.classesLoaded = true;
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      })
    }

  }

  // cancelEdit
  cancelSubject() {
    this.name = '';
    this.description = '';
    this.class = '';
    this.currentSubjectId = '';
    this.btnTitle = 'Add Subject';
    this.editingSubject = false;
  }

  import() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "subject";
    modalRef.result.then(() => {
      this.getSchoolSubjects();
    })
  }
  // getSlNo
  getSlNo(slNo) {
    return slNo + this.index;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }

  }
  getAdmin() {
    let userInfo = localStorage.getItem('info');
    this.schoolId = localStorage.getItem('schoolId');
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
    } else if (this.schoolId) {
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


      console.log(this.classmap, "this.class")

      this.cdr.detectChanges();

    })

  }
}
