import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Previlage } from '../previlages/previlage';
import { RolesService } from '../services/roles.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateRoleModalComponent } from '../modals/update-role-modal/update-role-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoadingService } from '../../../loader/loading/loading.service';
import { CreateservicesService } from '../../create/services/createservices.service';


@Component({
  selector: 'kt-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  isOwner: boolean;

  roles: Array<any>;
  rolesLoaded: boolean = false;
  index: number = 0;
  classCount: number = 10;
  roleForm: FormGroup;
  displayedColumns: string[] = ['displayName', 'description', 'roleName', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  existRole: boolean = false;
  branches: any = [];
  branchName: any;


  constructor(
    public apiService: RolesService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private loaderService: LoadingService,
    private createService: CreateservicesService
  ) {
    this.roleForm = this.createFormGroup()
  }

  ngOnInit(): void {
    this.loaderService.show();
    let counter = localStorage.getItem('roleNumber');
    let value = JSON.parse(counter)
    if(value==0){
      localStorage.setItem('roleNumber',JSON.stringify(1));
      window.location.reload();
    }
    this.getAllRoles();
    this.getAdmin();
    this.getBranches();
    this.loaderService.hide();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getBranches() {
    let id = localStorage.getItem('schoolId')
    if (id) {
      this.createService.getBranch(id).subscribe((response: any) => {
        //console.log(response.body.data)
        this.branches = response.body.data[0].branch;
      })
    }
  }

  checkDisplayNameValidation(value) {
    this.loaderService.show();
    console.log(value)
    this.existRole = false;
    let obj = {
      role_name: value
    }
    this.apiService.checkDuplicateDisplayName(obj).subscribe(
      (response: any) => {
        if (response && response.body) {
          response.body.flag ? this.existRole = true : this.existRole = false;
          this.loaderService.hide();
        }
        this.cdr.detectChanges();
      }
    )
  }

  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;


    if (user.user_info[0].profile_type.role_name == 'school_admin') {


      this.isOwner = true
      console.log(this.isOwner)
    }

    else {
      this.isOwner = false
      console.log(this.isOwner)
    }
  }
  // Step 1
  createFormGroup() {
    return this.formBuilder.group({
      display_name: ['', Validators.required],
      role_name: ['', Validators.required],
      description: [''],
      privilege: this.formBuilder.group(new Previlage()),
      type: ['custom'],
      // branch:['',Validators.required],
      repository: this.formBuilder.array([{
        id: [''],
        repository_type: [''],
      }])
    });
  }


  // getAllRoles() {
  //   this.apiService.getRoles().then(data => {
  //     this.roles = <any[]>data;
  //     this.dataSource.data = this.roles;
  //     this.rolesLoaded = true;
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
      this.dataSource.data = this.roles;
      this.rolesLoaded = true;
      this.cdr.detectChanges();
    },
      error => {
        console.log(error)
      })
  }



  addRole() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    if (user.user_info[0].school_id) {
      this.roleForm.controls['repository'].patchValue([{
        id: user.user_info[0].school_id,
        repository_type: 'School',
        // branch:this.roleForm.get('branch').value
      }])
    } else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        // id= user.user_info[0].repository[0].id
        // repo=user.user_info[0].repository[0].repository_type;
        this.roleForm.controls['repository'].patchValue([{
          id: user.user_info[0].repository[0].id,
          repository_type: user.user_info[0].repository[0].repository_type,
          // branch:this.roleForm.get('branch').value
        }])
      } else {
        // id= user.user_info[0]._id
        // repo='Global'
        this.roleForm.controls['repository'].patchValue([{
          id: user.user_info[0]._id,
          repository_type: 'Global',
          // branch:this.roleForm.get('branch').value
        }])
      }

      // this.roleForm.controls['repository'].patchValue([{
      //   id: user.user_info[0]._id,
      //   repository_type: 'Global',
      //   // branch:this.roleForm.get('branch').value
      // }])

    }

    const roleData = {

      display_name: this.roleForm.get('display_name').value,
      role_name: this.roleForm.get('role_name').value,
      description: this.roleForm.get('description').value,
      privilege: this.roleForm.get('privilege').value,
      type: 'custom',
      repository: this.roleForm.controls['repository'].value
    }
    if (user.user_info[0].school_id) {
      roleData['school_id'] = user.user_info[0].school_id;
    }
    console.log(roleData)
    this.apiService.addRole(roleData).subscribe((response: any) => {
      Swal.fire('Success', 'New Role Created', 'success');
      this.getAllRoles();
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

    })
    this.getAllRoles();
  }

  // deleteRole
  deleteRole(row) {
    this.loaderService.show();
    let data = {
      roleId: row._id,
    }
    this.apiService.deleteRole(data).subscribe((res) => {
      this.getAllRoles();
      this.loaderService.hide();
    }, err => {
      this.loaderService.hide();
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
  }

  //UpdateRole
  updateRole(role) {
    const modalRef = this.modalService.open(UpdateRoleModalComponent, { size: 'xl' });
    modalRef.componentInstance.role = role;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
