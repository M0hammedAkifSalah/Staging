import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportFromGlobalComponent } from '../import-from-global/import-from-global.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as _ from 'lodash';


@Component({
  selector: 'kt-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  schoolId: string;

  constructor(
    public apiService: LearningService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }
  schools: any[] = []
  name: any;
  isOwner: boolean;
  description: any;
  classes: Array<any>;
  classesLoaded: boolean = false;
  index: number = 0;
  classCount: number = 1000;
  btnTitle = 'Add Class';
  editingClass: boolean = false;
  currentClassId: any;
  displayedColumns: string[] = ['name', 'description', 'action'];
  dataSource = new MatTableDataSource<any>();
  displayedColumns2: string[] = ['name', 'description','action'];
  length: number = 0
  dataSource2 = new MatTableDataSource<any>();
  @ViewChild('MatPaginator') paginator: MatPaginator;
  @ViewChild('MatPaginator1') paginator1: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  ngOnInit(): void {
    this.getAllClasses();
    this.getAdmin();
    this.getallinstitutes();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource2.paginator = this.paginator1;
    this.dataSource2.sort = this.sort;
  }

  addClass(data) {
    if (data.name) {
      let userInfo = localStorage.getItem('info');
      let user = JSON.parse(userInfo);
      let id: any;
      let repo: any;
      if (user.user_info[0].school_id) {
        id = user.user_info[0].school_id;
        repo = 'School';
      }
      // } else {
      //   id = user.user_info[0].id;
      //   // id = user.user_info[0].repository[0].id;
      //   repo = 'Global';
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
      const classData = {
        'description': this.description,
        'name': data.name,
        'repository': [{ 'id': id, 'branch_name': '', 'repository_type': repo }],
        'createdBy': localStorage.getItem('UserName')
      }
      if (this.editingClass) {
        if (this.currentClassId) {
          this.apiService.updateClass(this.currentClassId, classData, id, data.name).subscribe((response: any) => {
            Swal.fire('Success', 'Class Updated', 'success').then(() => location.reload());
            let element = document.getElementById('reset') as HTMLElement;
            this.getAllClasses()
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
        this.apiService.addClass(classData, id, data.name).subscribe((response: any) => {
          Swal.fire('Success', 'Class Added', 'success').then(() => { });
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
        this.ngOnInit();
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Name is required' });
      return;
    }
    this.ngOnInit();
  }

  // updateClass
  updateClass(id, name, description) {
    this.name = name;
    this.description = description;
    this.currentClassId = id;
    this.btnTitle = 'Update Class';
    this.editingClass = true;
  }

  deleteClass(row) {
    this.classesLoaded = false;
    if (this.isOwner) { // is school admin
      let data = {
        classId: row._id,
        schoolId: this.schoolId
      }
      this.apiService.deleteSchoolAdminClass(data).subscribe((res) => {
        this.getallinstitutes();
      }, err => {
        this.classesLoaded = true;
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      })
    } else {
      let data = {
        classId: row._id,
      }
      this.apiService.deleteGlobalClass(data).subscribe((res) => {
        this.getAllClasses();
      }, err => {
        this.classesLoaded = true;
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      })
    }
  }

  // cancelEdit
  cancelEdit() {
    this.name = '';
    this.description = '';
    this.currentClassId = '';
    this.btnTitle = 'Add Class';
    this.editingClass = false;
  }
  // Get all classes this is for global
  getAllClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      let classes = [];
      if (response && response.body && response.body.data) {
        this.dataSource.data = _.sortBy(response.body.data, 'name');
        console.log("lengthhhhh", this.dataSource.data.length)
        this.classes = response.body.data
      }
      // for (let i = this.index; i < this.classCount; i++) {
      //   if (response.body.data[i]) {
      //     classes.push(response.body.data[i]);
      //   }
      // }
      this.classesLoaded = true;
      // this.classes = classes;
      // this.dataSource.data = this.classes;
      this.length = this.classes.length;
      this.cdr.detectChanges();
      console.log(' this.classes', this.classes);
    })
  }
  // Pagination
  next() {
    this.classesLoaded = false;
    this.index = this.index + 10;
    this.classCount = this.classCount + 10;
    this.getAllClasses();
  }
  prev() {
    if (this.index != 0) {
      this.classesLoaded = false;
      this.index = this.index - 10;
      this.classCount = this.classCount - 10;
      this.getAllClasses();
    }
  }
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

  import() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "class";
    modalRef.result.then(() => {
      this.getallinstitutes(); // for school
      this.getAllClasses(); // for global
    })
  }

  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)

    if (user.user_info[0].school_id) {
      this.schoolId = user.user_info[0].school_id;
    } else {
      this.schoolId = user.user_info[0]._id;
    }

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
    let id: any= localStorage.getItem('schoolId');


    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.schools = data.body.data;
      this.dataSource2.data = this.schools[0].classList;

      // console.log(this.dataSource2, "c")
      // console.log(this.dataSource2.data, "c2")
      this.cdr.detectChanges();

    })

  }
}
