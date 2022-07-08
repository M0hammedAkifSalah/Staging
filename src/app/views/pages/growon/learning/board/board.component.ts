import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { ImportFromGlobalComponent } from '../import-from-global/import-from-global.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'kt-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  schoolId: string;

  constructor(private apiService: LearningService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) { }
  name: any;
  description: any;
  boards: any;
  SchoolBoards: any;
  classesLoaded: boolean = false;
  index: number = 0;
  classCount: number = 100;
  currentBoardId: any;
  title: string = 'Add Board';
  editingBoard: boolean = false;
  displayedColumns: string[] = ['name', 'description', 'createdBy', 'action'];
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  isOwner: boolean;
  @ViewChild('MatPaginator') paginator: MatPaginator;
  @ViewChild('MatPaginator1') paginator1: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  classes: any;
  class: any;

  // btnTitle:string = 'Update Board';
  ngOnInit(): void {
    this.getBoards();
    this.getClasses();
    this.getAdmin();
    this.getSchoolBoards();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource2.paginator = this.paginator1;
    this.dataSource2.sort = this.sort;
  }

  addBoard(data) {
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
      const boardData = {
        'class_id': this.class,
        'name': data.name,
        'description': this.description,
        'repository': [{
          'id': id, 'branch_name': '', 'repository_type': repo, 'mapDetails': [],
        }],
        'createdBy': localStorage.getItem('UserName'),
        'updatedBy': localStorage.getItem('UserName'),
      }
      if (this.currentBoardId) {
        this.apiService.updateBoard(this.currentBoardId, boardData, id, data.name).subscribe((response: any) => {
          if (response.status == 200) {
            Swal.fire('Success', 'Board Updated', 'success').then(() => window.location.reload());
            let element = document.getElementById('reset') as HTMLElement;
            element.click();
            // window.location.reload();
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
        this.apiService.addBoards(boardData, id, data.name).subscribe((response: any) => {
          if (response.status == 201) {
            Swal.fire('Success', 'Board Added', 'success').then(() => {
              this.class = '';
              this.name = '';
              this.description = '';
              this.cdr.detectChanges();
              //    window.location.reload()
            });
            let element = document.getElementById('reset') as HTMLElement;
            element.click();
            // window.location.reload();
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
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter name and description' });
      return;
    }
    this.ngOnInit();
  }
  // get Add boards
  getBoards() {
    this.apiService.getBoards().subscribe((response: any) => {
      let boards = [];
      for (let i = this.index; i < this.classCount; i++) {
        if (response.body.data[i]) {
          boards.push(response.body.data[i]);
        }
      }
      this.classesLoaded = true;
      this.boards = boards;
      this.dataSource.data = this.boards;
      // this.boards = response.body.data.board;
      this.cdr.detectChanges();
    })
  }
  getSchoolBoards() {
    this.apiService.getSchoolBoards().subscribe((response: any) => {
      // let boards = [];
      // for (let i = this.index; i < this.classCount; i++) {
      //   if (response.body.data[i]) {
      //     boards.push(response.body.data[i]);
      //   }
      // }
      this.dataSource2.data = response.body.data;
      this.SchoolBoards = response.body.data;
      this.classesLoaded = true;
      // this.SchoolBoards = boards;
      // this.dataSource2.data = this.SchoolBoards;
      console.log(this.SchoolBoards, "this.SchoolBoards")
      // this.boards = response.body.data.board;
      this.cdr.detectChanges();
    })
  }
  // updateBoard
  updateBoard(id, name, description, bClass) {
    this.class = bClass;
    this.name = name;
    this.description = description;
    this.currentBoardId = id;
    this.title = 'Edit Board';
    this.editingBoard = true;
  }

  deleteBoard(row) {
    this.classesLoaded = false;
    if (this.isOwner) { // is school admin
      let data = {
        boardId: row._id,
        schoolId: this.schoolId
      }
      this.apiService.deleteSchoolAdminBoard(data).subscribe((res) => {
        this.getSchoolBoards();
      }, err => {
        this.classesLoaded = true;
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      })
    } else {
      let data = {
        boardId: row._id,
      }
      this.apiService.deleteGlobalBoard(data).subscribe((res) => {
        this.getBoards();
      }, err => {
        this.classesLoaded = true;
        Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
      })
    }
  }

  // cancelEdit
  cancelEdit() {
    this.class = '';
    this.name = '';
    this.description = '';
    this.currentBoardId = '';
    this.title = 'Add Board';
    this.editingBoard = false;
  }
  // Pagination
  next() {
    this.classesLoaded = false;
    this.index = this.index + 10;
    this.classCount = this.classCount + 10;
    this.getBoards();
  }
  prev() {
    if (this.index != 0) {
      this.classesLoaded = false;
      this.index = this.index - 10;
      this.classCount = this.classCount - 10;
      this.getBoards();
    }
  }
  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
      this.cdr.detectChanges();
    });
  }
  // getSlNo
  getSlNo(slNo) {
    return slNo + this.index;
  }
  import() {
    const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    modalRef.componentInstance.type = "board";
    modalRef.result.then(() => {
      this.getSchoolBoards();
    })

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
    else if (this.schoolId)
      this.isOwner = true;
    else {
      this.isOwner = false
    }
  }
}
