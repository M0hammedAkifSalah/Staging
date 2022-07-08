import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CreateservicesService } from '../../../create/services/createservices.service';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'kt-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.scss']
})
export class UpdateUserModalComponent implements OnInit {

  @Input() user;
  userForm: FormGroup;
  branches = [];
  countries = [];
  states = [];
  cities = [];
  roles = [];
  genders: Array<string> = ['Male', 'Female'];
  maritalStatus: Array<string> = ['Married', 'Unmarried', 'Divorce', 'Widow', 'Widower'];
  @ViewChild('firstname') nameInput: MatInput;

  constructor(public activeModal: NgbActiveModal,
    public _formBuilder: FormBuilder,
    public cdr: ChangeDetectorRef,
    public createApiServices: CreateservicesService,
    public apiService: RolesService) { }

  ngOnInit(): void {
    console.log(this.user)
    this.userForm = this.createFormGroup();
    this.getCountries();
    this.getStates();
    this.getCities();

    if (this.user.repository[0].repository_type == 'School') {
      this.getBranches();
    }
    this.getRoles();

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 10);
  }

  ngAfterViewInit() {
    this.nameInput.focus();
    this.cdr.detectChanges();
  }

  createFormGroup() {

    return this._formBuilder.group({
      name: [this.user.name, Validators.required],
      mobile: [this.user.mobile, Validators.required],
      gender: [this.user.gender,],
      branch_id: [this.user.branch_id,],
      school_id: [this.user.repository ? this.user.repository[0].id : '', Validators.required],
      dob: [this.user.dob,],
      email: [this.user.email, [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      address: [this.user.address, Validators.maxLength(150)],
      aadhar_card: [this.user.aadhar_card, [Validators.maxLength(25), Validators.pattern("^[0-9]*$")]],
      blood_gr: [this.user.blood_gr],
      religion: [this.user.religion],
      caste: [this.user.caste],
      city: [this.user.city],
      state: [this.user.state],
      country: [this.user.country],
      pincode: [this.user.pincode, [Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      mother_tounge: [this.user.mother_tounge],
      marital_status: [this.user.marital_status],
      password: [this.user.password, Validators.required],
      profile_type: this.user.profile_type,
      role_name: this.user.profile_type.role_name,
      // repository: this._formBuilder.array([{
      //   id: [this.user.repository[0] ? this.user.repository[0].id : ''],
      //   repository_type: [this.user.repository[0] ? this.user.repository[0].repository_type : '']
      // }]),
      repository: this.user.profile_type.repository,
      secondary_profile_type: [this.user.secondary_profile_type],
      _id: [this.user._id]

    });
  }


  // getBranches() {
  //   this.createApiServices.getBranch(this.user.repository[0].id).subscribe((response: any) => {
  //     console.log(response)
  //     this.branches = response.body.data.getSchool.branch;
  //     this.cdr.detectChanges();
  //     console.log(this.branches)
  //   })
  // }
  getBranches() {
    this.createApiServices.getBranch(localStorage.getItem('schoolId')).subscribe((response: any) => {
      this.branches = response.body.data[0].branch;
      console.log(response)
      console.log(this.branches)
      this.cdr.detectChanges();
    })
  }
  // getCountries() {
  //   this.createApiServices.getCountries().subscribe((response: any) => {
  //     this.countries = response.body.data;
  //     this.cdr.detectChanges();
  //   })
  // }
  // getStates() {
  //   this.createApiServices.getStates().subscribe((response: any) => {
  //     this.states = response.body.data;
  //     this.cdr.detectChanges();
  //   })
  // }
  // getCities() {
  //   this.createApiServices.getCities().subscribe((response: any) => {
  //     this.cities = response.body.data;
  //     this.cdr.detectChanges();
  //   })
  // }

  getCountries() {

    this.createApiServices.getCountries().subscribe((response: any) => {
      this.countries = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getStates() {
    this.createApiServices.getStates().subscribe((response: any) => {
      // this.states = response.body.data;
      this.states = response.body.data.filter(usr => {
        return usr.country_id == this.userForm.get('country').value
      })
      this.cdr.detectChanges();
    })
  }
  getCities() {
    this.createApiServices.getCities().subscribe((response: any) => {
      // this.cities = response.body.data;
      this.cities = response.body.data.filter(usr => {
        return usr.state_id == this.userForm.controls.state.value

      })
      this.cdr.detectChanges();
    })
  }
  // getRoles() {
  //   this.apiService.getRoles().then(data => {
  //     this.roles = <any[]>data
  //     this.cdr.detectChanges();
  //   })
  // }
  getRoles() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let reqData;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;


    }
    else {
      id = user.user_info[0]._id;

    }
    reqData = {
      "repository.id": id

    }

    let data = reqData;
    this.apiService.getdashboardRole(data).subscribe((response: any) => {
      console.log(response)
      this.roles = response.body.data;

      this.cdr.detectChanges();
    })
  }

  updateUser() {
    this.apiService.updateUser(this.userForm.value).subscribe((response: any) => {
      console.log(response)
      if (response.status == 201 || response.status == 204) {
        Swal.fire('Account Updated', ' account updated successfully', 'success');
        this.activeModal.close();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
      }
    })
  }


}
