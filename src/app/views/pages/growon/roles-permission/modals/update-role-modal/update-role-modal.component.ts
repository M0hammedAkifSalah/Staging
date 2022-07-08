import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from 'src/app/core/auth';
import Swal from 'sweetalert2';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'kt-update-role-modal',
  templateUrl: './update-role-modal.component.html',
  styleUrls: ['./update-role-modal.component.scss']
})
export class UpdateRoleModalComponent implements OnInit {
  @Input() role;
  updateRoleForm: FormGroup;
  isOwner: boolean;
  constructor(public activeModal: NgbActiveModal,
    public formBuilder: FormBuilder,
    public apiService: RolesService,
  ) { }

  ngOnInit(): void {
    this.createUpdateForm();
    this.getAdmin();
    console.log(this.role)
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
  createUpdateForm() {
    this.updateRoleForm = this.formBuilder.group({
      description: [this.role.description],
      display_name: [this.role.display_name],
      privilege: this.formBuilder.group(this.role.privilege),
      // repository: this.formBuilder.array([{
      //   id: [this.role.repository[0].id],
      //   repository_type: [this.role.repository[0].repository_type]
      // }]),
      repository: [this.role.repository],
      // repository: [{
      //   id: [this.role.repository[0].id],
      //   repository_type: [this.role.repository[0].repository_type]
      // }],
      role_name: [this.role.role_name, Validators.required],
      type: [this.role.type],
      _id: [this.role._id]
    })
  }

  updateRole() {
    this.apiService.updateRole(this.updateRoleForm.value).subscribe((response: any) => {
      Swal.fire('Success', 'Class Added', 'success');
      let element = document.getElementById('reset') as HTMLElement;
      element.click();
      this.activeModal.close();
    }, (error) => {
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
