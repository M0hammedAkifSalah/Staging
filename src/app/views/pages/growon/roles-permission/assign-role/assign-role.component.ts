import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { UpdatePrincipleModalComponent } from '../modals/update-principle-modal/update-principle-modal.component';
import { UpdateTeacherModalComponent } from '../modals/update-teacher-modal/update-teacher-modal.component';
import { UpdateUserModalComponent } from '../modals/update-user-modal/update-user-modal.component';
import { RolesService } from '../services/roles.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { defaultRoles } from '../default-roles';


@Component({
  selector: 'kt-assign-role',
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.scss']
})
export class AssignRoleComponent implements OnInit {

  assignRoleForm: FormGroup;
  roles = [];
  users = [];
  userLoaded: boolean = false;
  displayedColumns: string[] = ['name', 'mobile', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  schoolId: any;
  reqData: {};
  isOwner: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private apiService: RolesService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {
    this.assignRoleForm = this.createFormGroup();

  }

  ngOnInit(): void {
    let counter = localStorage.getItem('assignUser');
    let value = JSON.parse(counter)
    if(value==0){
      localStorage.setItem('assignUser',JSON.stringify(1));
      window.location.reload();
    }
    this.setConfig();
    this.getAllRoles();
    this.getAllUsers();
  }

  setConfig() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let reqData;

    if (user.user_info[0].school_id) {
      this.schoolId = user.user_info[0].school_id;
      this.reqData = {
        "school_id": this.schoolId
      }
    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.schoolId = user.user_info[0].repository[0].id
        this.schoolId = user.user_info[0].repository[0].repository_type;
      } else {
        this.schoolId = user.user_info[0]._id
      }
      this.reqData = {
        "repository.id": this.schoolId
      }
    }

    if (user.user_info[0].profile_type.role_name == 'school_admin' ||
      user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'management'
      || user.user_info[0].profile_type.role_name == 'principal') {
      this.isOwner = true
    } else if (localStorage.getItem('schoolId')) {
      this.isOwner = true;
    }
    else {
      this.isOwner = false
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Step 1
  createFormGroup() {
    return this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      mobile: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(15), Validators.required]],
      password: ['', Validators.required],
      email: ['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      profile_type: ['', Validators.required],
      repository: this.formBuilder.array([{
        id: [''],
        repository_type: ['']
      }])
    });
  }

  // Get all roles
  // getAllRoles() {
  //   this.apiService.getRoles().then(data => {
  //     this.roles = <any[]>data

  //     this.userLoaded = true;

  //   })
  // }
  // getAllRoles() {
  //   this.apiService.getdashboardRole(this.reqData).subscribe((response: any) => {
  //     console.log(response)
  //     this.roles = response.body.data;
  //     this.dataSource.data = this.roles;
  //     this.userLoaded = true;
  //     this.cdr.detectChanges();
  //   })
  // }
  getAllRoles() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let reqData;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;


    }
    else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        id = user.user_info[0].repository[0].id
        // repo=user.user_info[0].repository[0].repository_type;
      } else {
        id = user.user_info[0]._id
        // repo='Global'
      }



    }
    reqData = {
      "repository.id": id

    }


    this.apiService.getdashboardRole(reqData).subscribe((response: any) => {
      console.log(response)
      this.roles = response.body.data;


      this.cdr.detectChanges();
    },
      error => {
        console.log(error)
      })
  }
  // Get all roles
  getAllUsers() {
    this.apiService.getAllDashboardUsers(this.reqData).subscribe((response: any) => {
      this.users = Object.assign(response.body.data);
      // this.dataSource.data = this.users;

      // console.log(this.users.filter(row => row.profile_type.role_name !== 'teacher'))
      this.dataSource.data = this.users.filter(row => row.profile_type !== '5fd2f18f9cc6537951f0b35c' &&
        row.profile_type !== '5fd1c755ba54044664ff8c0f' && row.profile_type !== '5fd1c839ba54044664ff8c10'
        && row.profile_type !== '5fd2f1e59cc6537951f0b35d' && row.profile_type !== '5fd1c4f6ba54044664ff8c0d');
      // this.dataSource.data = this.users
      this.userLoaded = true;
      console.log(this.users, "assign role data")
      this.cdr.detectChanges();
    })
  }

  // Get all roles
  addUser() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    if (user.user_info[0].school_id) {
      this.assignRoleForm.controls['repository'].patchValue([{
        id: user.user_info[0].school_id,
        repository_type: 'School'
      }])
    } else {
      this.assignRoleForm.controls['repository'].patchValue([{
        id: user.user_info[0]._id,
        repository_type: 'Global'
      }])

    }

    const assignRole = {
      name: this.assignRoleForm.get('name').value,
      mobile: this.assignRoleForm.get('mobile').value,
      password: this.assignRoleForm.get('password').value,
      email: this.assignRoleForm.get('email').value,
      profile_type: this.assignRoleForm.get('profile_type').value,
      repository: this.assignRoleForm.controls['repository'].value
    }
    if (user.user_info[0].school_id) {
      assignRole['school_id'] = user.user_info[0].school_id;
    }

    this.apiService.addUser(assignRole).subscribe((response: any) => {
      console.log(response)
      Swal.fire('Success', ' Role assigned to the user', 'success').then(() => {
        this.cdr.detectChanges();
        //    window.location.reload()
      });;
      let element = document.getElementById('reset') as HTMLElement;
      element.click();
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error ', text: error.error.data });
        return;
      }
    })
    this.ngOnInit();
    this.cdr.detectChanges();
  }


  //UpdateUser
  updateUser(user) {
    console.log(user)
    switch (user.profile_type.role_name) {
      case 'teacher':
        let modalRefTeacher = this.modalService.open(UpdateTeacherModalComponent, { size: 'xl' });
        modalRefTeacher.componentInstance.user = user;
        break;
      case 'principal':
        let modalRefPrinciple = this.modalService.open(UpdatePrincipleModalComponent, { size: 'xl' });
        modalRefPrinciple.componentInstance.user = user;
        break;
      default:
        let modalRefUser = this.modalService.open(UpdateUserModalComponent, { size: 'xl' });
        modalRefUser.componentInstance.user = user;
        this.getAllUsers();
        break;
    }

  }

  deleteUser(row) {
    console.log('vgcfgxxfcgvhb', row)
    this.userLoaded = false;
    let data = {
      userId: row._id,
      isGlobal: this.isOwner ? false : true,
      isStudent: false,
      repositoryId: this.schoolId
    }
    this.apiService.deleteUser(data).subscribe((res) => {
      this.getAllUsers();
    }, err => {
      this.userLoaded = true;
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
