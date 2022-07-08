import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportFromGlobalComponent } from '../import-from-global/import-from-global.component';

@Component({
  selector: 'kt-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.scss']
})
export class SyllabusComponent implements OnInit {
  schoolId: string;

  constructor(private apiService: LearningService, private cdr: ChangeDetectorRef,
    private modalService: NgbModal) { }
  name: any;
  isOwner: boolean;
  description: any;
  syllabus: any;
  Schoolsyllabus: any;
  classesLoaded: boolean = false;
  index: number = 0;
  classCount: number = 100;
  title: string = 'Add Syllabus';
  editingSyllabus: boolean = false;
  selectedId: any;
  classes: any;
  class: any;
  displayedColumns: string[] = ['name', 'description', 'createdBy', 'action'];
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.getSyllabus();
    this.getClasses();
    this.getAdmin();
    this.getSchoolSyllabus();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource2.paginator = this.paginator;
    this.dataSource2.sort = this.sort
  }
  addSyllabus(data) {
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

      const sectionData = {
        'class_id': this.class,
        'name': data.name,
        'description': this.description,
        'repository': [{
          'id': id, 'branch_name': '', 'repository_type': repo, 'mapDetails': [],
        }],
        'createdBy': localStorage.getItem('UserName')
      }
      if (this.selectedId) {
        this.apiService.updateSyllabus(this.selectedId, sectionData, id, data.name).subscribe((response: any) => {
          if (response.status == 200) {
            Swal.fire('Success', 'Syllabus updated', 'success').then(() => window.location.reload());
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
        });
      } else {
        this.apiService.addSyllabus(sectionData, id, data.name).subscribe((response: any) => {
          if (response.status == 201) {
            // Swal.fire('Success', 'Syllabus Added', 'success').then(() => window.location.reload());
            Swal.fire('Success', 'Syllabus Added', 'success').then(() => {
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
        });
        this.ngOnInit();
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Name and Description are required' });
      return;
    }
    this.ngOnInit();
  }
  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      // this.syllabus = response.body.data.syllabusData;
      let syl = [];
      for (let i = this.index; i < this.classCount; i++) {
        if (response.body.data[i]) {
          syl.push(response.body.data[i]);
        }
      }
      this.classesLoaded = true;
      this.syllabus = syl;
      this.dataSource.data = this.syllabus;
      this.cdr.detectChanges();
    })
  }
  getSchoolSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      // this.syllabus = response.body.data.syllabusData;
      let syl = [];
      for (let i = this.index; i < this.classCount; i++) {
        if (response.body.data[i]) {
          syl.push(response.body.data[i]);
        }
      }
      this.classesLoaded = true;
      this.Schoolsyllabus = syl;
      this.dataSource2.data = this.Schoolsyllabus;
      this.cdr.detectChanges();
    })
  }


  // updateSyllabus
  updateSyllabus(id, name, description, sylClass) {
    this.selectedId = id;
    this.name = name;
    this.description = description;
    this.class = sylClass;
    this.title = 'Edit Syllabus'
    this.editingSyllabus = true;
  }

  deleteSyllabus(row) {
    this.classesLoaded = false;
    if (this.isOwner) { // is school admin
      let data = {
        syllabusId: row._id,
        schoolId: this.schoolId
      }
      this.apiService.deleteSchoolAdminSyllabus(data).subscribe((res) => {
        this.getSchoolSyllabus();
      }, err => {
        this.classesLoaded = true;
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      })
    } else {
      let data = {
        syllabusId: row._id,
      }
      this.apiService.deleteGlobalSyllabus(data).subscribe((res) => {
        this.getSyllabus();
      }, err => {
        this.classesLoaded = true;
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      })
    }
  }
  // cancelEdit
  cancelEdit() {
    this.selectedId = '';
    this.class = '';
    this.name = '';
    this.description = '';
    this.title = 'Add Syllabus';
    this.editingSyllabus = false;
  }
  // Pagination
  next() {
    this.classesLoaded = false;
    this.index = this.index + 10;
    this.classCount = this.classCount + 10;
    this.getSyllabus();
  }
  prev() {
    if (this.index != 0) {
      this.classesLoaded = false;
      this.index = this.index - 10;
      this.classCount = this.classCount - 10;
      this.getSyllabus();
    }
  }
  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
      this.cdr.detectChanges();
    });
  }
  import() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "syllabus";
    modalRef.result.then(() => {
      this.getSchoolSyllabus();
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
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;
    this.schoolId = localStorage.getItem('schoolId');

    // defaultRoles.find(role => { return role.role_name == 'admin' })
    if (user.user_info[0].profile_type.role_name == 'school_admin' ||
      user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'management'
      || user.user_info[0].profile_type.role_name == 'principal') {

      this.isOwner = true
      console.log(this.isOwner)
    }
    else if (this.schoolId) {
      this.isOwner = true;
    }
    else {
      this.isOwner = false
    }
  }
}
